# References

Handy links for documentation, articles, and other materials used in this project.

- [`date-fns` documentation][1]
- FusionAuth
  - [FusionAuth docs][2]
  - [Login and authentication workflows][29]
- GraphQL
  - [Full stack app][3] (with Next.js (React), Apollo Client, Apollo Server and Nexus)
  - [Next.js API example][4] (in the Next.js repo)
  - [Nexus][5] docs
  - [Nexus with Next.js example][6] (in the Nexus repo)
  - [Prisma GraphQL docs][7]
- Grommet
  - [Components][8]
  - [Icons][9]
  - [Storybook][10]
- [HTTP Status Codes][11]
- [Hasura][28] docs
- JWTs
  - [Building a Secure Signed JWT][16]
  - [JWT Debugger][27] from Auth0
  - Public and private claims and namespaces
    - Auth0: [Add custom claims to a token][26]
    - Auth0: [Create namespaced custom claims][25]
    - SO: [What is difference between private and public claims?][24]
  - Verifying claims
    1. How to [verify JWT claims][12] with FusionAuth Java library
    2. API docs for verifying JWT claims with [Jose JavaScript module][13]
    3. [FusionAuth API][14] for verifying a JWT
- [Next.js documentation][15]
- OpenID Connect
  - [ID token][17]
  - [Standard claims][18]
- [OpenID client][19] for Node.js
- [Prisma documentation][20]
- [SWR docs][21]
- [Task][22] (aka "Taskfile" or "Gotask")
- UUID-related packages
  - [nanoid][30]
  - [short-uuid][33]
  - [uuid-apikey][32]
  - [uuid][31]
- [Volta reference][23]

[1]: https://date-fns.org/docs/Getting-Started
[2]: https://fusionauth.io/docs/v1/tech/
[3]: https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs/pages/api
[4]: https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql
[5]: https://nexusjs.org/
[6]: https://github.com/graphql-nexus/nexus/tree/main/examples/with-prisma
[7]: https://www.prisma.io/docs/concepts/overview/prisma-in-your-stack/graphql
[8]: https://v2.grommet.io/components
[9]: https://icons.grommet.io/
[10]: https://storybook.grommet.io/?path=/story/all--all
[11]: https://www.restapitutorial.com/httpstatuscodes.html
[12]: https://github.com/fusionauth/fusionauth-jwt#verify-and-decode-a-jwt-using-rsa
[13]: https://github.com/panva/jose/blob/HEAD/docs/functions/jwt_verify.jwtVerify.md#readme
[14]: https://fusionauth.io/docs/v1/tech/apis/jwt/#validate-a-jwt
[15]: https://nextjs.org/docs/getting-started
[16]: https://fusionauth.io/learn/expert-advice/tokens/building-a-secure-jwt/
[17]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
[18]: https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
[19]: https://github.com/panva/node-openid-client
[20]: https://www.prisma.io/docs/
[21]: https://swr.vercel.app/docs/getting-started
[22]: https://taskfile.dev/#/
[23]: https://docs.volta.sh/reference/
[24]: https://stackoverflow.com/questions/49215866/what-is-difference-between-private-and-public-claims-on-jwt
[25]: https://auth0.com/docs/security/tokens/json-web-tokens/create-namespaced-custom-claims
[26]: https://auth0.com/docs/configure/apis/scopes/sample-use-cases-scopes-and-claims#add-custom-claims-to-a-token
[27]: https://jwt.io/#debugger-io
[28]: https://hasura.io/docs/latest/graphql/core/index.html
[29]: https://fusionauth.io/learn/expert-advice/authentication/login-authentication-workflows/
[30]: https://www.npmjs.com/package/nanoid
[31]: https://www.npmjs.com/package/uuid
[32]: https://www.npmjs.com/package/uuid-apikey
[33]: https://www.npmjs.com/package/short-uuid
