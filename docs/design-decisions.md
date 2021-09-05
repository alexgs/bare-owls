# Design Decisions

This document records why things in the product are done a certain way.

## JWT Signing Keys

### Current

- Start date: 2021-09-05

I'm just using a single "Application" and "Tenant" in FusionAuth, and I'm currently using the default OpenID-connect compatible HMAC signing key.

Reference: See "Creating Tokens > Signature Algorithms" subsection of the [Building a Secure JWT][1] article.

[1]: https://fusionauth.io/learn/expert-advice/tokens/building-a-secure-jwt/

### Future

When using client-accessible JWTs to access a CDN, we will need to use a public/private key to sign and verify claims. One option is to change the signing key for the whole application in FusionAuth.

However, I think it will make more sense to have separate applications within FusionAuth. The main application can use the default tenant settings (although it may make life easier to set them directly on the application). The CDN application will use custom settings.

I don't like how the OpenID-connect compatible HMAC signing key uses the client secret. I guess there's not much point in having two secrets (one for OAuth and another for HMAC) because anyone who can access one can access the other. There may be implications for changing or rotating the client secret and the HMAC secret. I'm not sure if there's a good reason to change this or not. I'm not concerned about complying with the OIDC standard, so that is not a consideration.
