# Design Decisions

This document records why things in the product are done a certain way.

## JWT Signing Keys

### Previously

- Start date: 2021-09-05
- End date: 2021-09-18

I'm just using a single "Application" and "Tenant" in FusionAuth, and I'm currently using the default OpenID-connect compatible HMAC signing key.

Reference: See "Creating Tokens > Signature Algorithms" subsection of the [Building a Secure JWT][1] article.

[1]: https://fusionauth.io/learn/expert-advice/tokens/building-a-secure-jwt/

### Current & Near-Future

- Start date: 2021-09-18

We either have or shortly will have two applications configured in FusionAuth: a "core" application representing the Docker Compose project and a "CDN" application representing CloudFlare. The JWT for the core application is signed with HMAC for speed. For this reason, the Hasura auth webhook validates JWTs for all GraphQL methods against the FA API. It's just easier and faster. We _could_ look at the different methods and validate some locally (within the webhook) and others (namely mutations) against the API. With HMAC, however, that requires sharing the secret and stuff; it seems like a lot of work for an indefinite gain.

The CDN JWT, in contrast to the core JWT, will be signed with a public/private key pair. This will allow CloudFlare workers to validate the JWT locally without having to contact the central auth server. In this scenario, a JWT could be revoked and the client wouldn't know until it needed to get a new JWT. For this reason, the CDN application is **strictly read-only**.

If someone has illicit access and it is revoked, it's not a big deal for the bad actor to have an extra 15 minutes of access. The power to create and delete content, is much more dangerous. We will require token validation for every request to create, update, or delete content.

## Next.js API Middleware

The Next.js examples include a [middleware][2] pattern. [The documentation][3], however, cautions against using this pattern with Typescript as it can degrade type safety. The documentation provides an alternate pattern for using a pure function within the API handler to implement middleware-like functionality in a type-safe way. We are using this pattern.

[2]: https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
[3]: https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript

## Post Public IDs

Each post needs a safe, publicly accessible ID that is unique within the post's channel. In other words, a path like `/c/[channelId]/p/[postId]` needs to have a unique combination of `channelID` and `postId`, but post IDs do not need to be globally unique.

I assume that creators will **NOT** be giving their posts titles and therefore we cannot construct a slug from the title.

To make post IDs human-readable, we will use Crockford base32 encoding. Three random bytes gives a limit of more than 16 million posts _per channel_, which seems like more than enough. With base32 encoding, this gives a 5 character code for the post. This is what we are using for the `publicId` for each post. (See [this RunKit code][6] for some examples.)

[6]: https://runkit.com/embed/8mbkvpgjwrrl

## Session Provider

The pattern I used for the `SessionProvider` (see [Session.tsx][4]) looks more like the normal React Context pattern than the [SWR pattern][5]. I previously used the SWR pattern and found it more cumbersome than the Context pattern. It's more a matter of taste at this stage, and this is easier. :shrug: It can always be revisited in the future if there's a need.

[4]: /webapp/components/Session.tsx
[5]: https://swr.vercel.app/docs/getting-started#example
