# References

Handy links for documentation, articles, and other materials used in this project.

- [`date-fns` documentation][1]
- Doppler
  - ["Bare Owls" project][34]
  - [Documentation][35]
- [Flyway][48], an open-source database migration tool
- FusionAuth
  - [FusionAuth docs][2]
  - [Login and authentication workflows][29]
  - [Typescript client][39]
- [Got][40]
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
- Prisma
  - [Documentation][20]
  - How to include [stored procedures and other unsupported features in a migration][47]. Note that we ran into problems when we tried to do this, which prompted our migration to [Flyway][48].
- PostgreSQL
  - [Automatic `updated_at` timestamps][49]
  - Check constraints
    - Great StackOverflow post on [referencing different tables][45] (similar to my idea for a post type _XOR_)
    - [Prisma tutorial][46] on how to do this in Postgres (**NB:** not supported on Prisma schema as of v2.30.3 and v3.0.2)
  - Unique constraints
    - Adding [constraints in PostgreSQL][43], including multi-column constraints
    - Specifying [constraints in a Prisma schema][44]
- React libraries, docs, and articles
  - [Formik][38]
- [SWR docs][21]
- [Task][22] (aka "Taskfile" or "Gotask")
- [Traefik][36]
- UUID-related packages
  - [nanoid][30]
  - [short-uuid][33]
  - [uuid-apikey][32]
  - [uuid][31]
- [Volta reference][23]
- Winston
  - [Docs][41]
  - [Log levels][42]
- [Yup][37] for validating JSON objects and other values

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
[34]: https://dashboard.doppler.com/workplace/98a6b3ff79724119c892/projects/bare-owls
[35]: https://docs.doppler.com/docs
[36]: https://doc.traefik.io/traefik/
[37]: https://github.com/jquense/yup
[38]: https://formik.org/docs/overview
[39]: https://github.com/FusionAuth/fusionauth-typescript-client
[40]: https://github.com/sindresorhus/got
[41]: https://github.com/winstonjs/winston#table-of-contents
[42]: https://github.com/winstonjs/winston#logging-levels
[43]: https://www.prisma.io/docs/guides/general-guides/database-workflows/unique-constraints-and-indexes/postgresql
[44]: https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-a-unique-field
[45]: https://stackoverflow.com/questions/10068033/postgresql-foreign-key-referencing-primary-keys-of-two-different-tables
[46]: https://www.prisma.io/docs/guides/database/advanced-database-tasks/data-validation/postgresql
[47]: https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/include-unsupported-database-features
[48]: https://flywaydb.org/documentation/
[49]: https://x-team.com/blog/automatic-timestamps-with-postgresql/
