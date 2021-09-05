# Design Decisions

This document records why things in the product are done a certain way.

## JWT Signing Keys

### Current

- Start date: 2021-09-05

I'm just using a single "Application" and "Tenant" in FusionAuth, and I'm currently using the default OpenID-connect compatible HMAC signing key.

Reference: See "Creating Tokens > Signature Algorithms" subsection of the [Building a Secure JWT][1] article.

[1]: https://fusionauth.io/learn/expert-advice/tokens/building-a-secure-jwt/

### Future

We will need to use separate applications in FusionAuth: one for the "core" application and one for the CDN. There is one main reason: FusionAuth uses the application ID for the "audience" claim in the JWT.

This configuration will also give us more control over the JWT claims and signing keys. The core application can use the default tenant settings (although it may make life easier to set them directly on the application). The CDN application will use custom settings.

I don't like how the OpenID-connect compatible HMAC signing key uses the client secret. I guess there's not much point in having two secrets (one for OAuth and another for HMAC) because anyone who can access one can access the other. There may be implications for changing or rotating the client secret and the HMAC secret. I'm not sure if there's a good reason to change this or not. I'm not concerned about complying with the OIDC standard, so that is not a consideration.

## Next.js API Middleware

The Next.js examples include a [middleware][2] pattern. [The documentation][3], however, cautions against using this pattern with Typescript as it can degrade type safety. The documentation provides an alternate pattern for using a pure function within the API handler to implement middleware-like functionality in a type-safe way. We are using this pattern.

[2]: https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
[3]: https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript
