# GraphQL

## Download schema from Hasura

Install `graphqurl`, which can be run from the command line with `gq`. The command to download the schema is

```shell
gq http://localhost:${HASURA_CONSOLE_PORT}/v1/graphql -H "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}" --introspect > schema.graphql
```

**Notes:**

  - This has to go through the local port on the Docker container. It doesn't work if I attempt to access it with `https://localhost.owlbear.tech/api/graphql`.
  - Doppler doesn't (yet?) work if I preface this command with `doppler run -- `, so I have to add in the values manually.

For more, see ["Exporting the Hasura GraphQL schema"][1] in the Hasura docs.

[1]: https://hasura.io/docs/latest/graphql/core/guides/export-graphql-schema.html#using-graphqurl
