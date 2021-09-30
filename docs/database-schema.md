# Database schema

Notes about the database schema. Maybe in the future, notes about operating the database and the PostreSQL server. :shrug:

## Schema prototyping

Inspired by [an article from the Prisma docs][2], I think we can use a combination of `prisma db push` and [Migra][1] to prototype database schema changes in development.

  1. Make changes in the Prisma schema.
  2. Push the changes with `prisma db push`.
  3. When the feature is done, run a diff on the schema with [Migra][1].
  4. Adapt Migra's output to an SQL migration file for use by Flyway.

[1]: https://databaseci.com/docs/migra
[2]: https://www.prisma.io/docs/guides/database/prototyping-schema-db-push
