# Database server

Database settings and configuration.

:boom: **WARNING** :boom: PostreSQL is weird about case sensitivity. The best solution is to use lower case for all database and role names. If you insist on using upper case, you _must_ wrap database and role names in double quotes.

## Common Commands

You'll need [Task][1] to do anything. You can run `task --list` to see other commands, or just peek at `Tasklist.yml`.

[1]: https://taskfile.dev/

1. To connect from a Node.js scripting container, first do `task node` to start and get a shell on the scripting container. (Warnings about missing variables can safely be ignored.)
1. From the container, you can do `psql -h database -U $DATABASE_USER -d $DATABASE_NAME`. You will be prompted for the `$DATABASE_PASSWORD`.

## Getting started in development

:boom: **WARNING** :boom: PostreSQL is weird about case sensitivity. The best solution is to use lower case for all database and role names. If you insist on using upper case, you _must_ wrap database and role names in double quotes.

1. Make sure the following keys are set in `../.env`. Values for `DATABASE_PASSWORD` and `DATABASE_USER` are not strictly necessary, but they are referenced in the instructions below. They are also used by the `../api` package.
```
DATABASE_HOST_DIRECTORY
DATABASE_NAME
DATABASE_PASSWORD
DATABASE_USER
DBADMIN_PASSWORD
DBADMIN_USER
```
2. Delete previous database files in `$DATABASE_HOST_DIRECTORY`, if any. You can use `task wipe-host-data`.
1. Run `task initialize`.
1. Run `task up` to start the application stack. You can verify that everything is okay with Postgres by checking the logs with `docker-compose logs -f database`.
1. Connect to the cluster from the host, `psql -h localhost -p $DATABASE_PORT -U $DBADMIN_USER -d $DATABASE_NAME`. As with subsequent commands, you will be prompted for `$DBADMIN_PASSWORD`.
1. Execute the following queries
```sql
CREATE ROLE $DATABASE_USER
  WITH LOGIN PASSWORD '$DATABASE_PASSWORD';

REVOKE ALL ON DATABASE $DATABASE_NAME
  FROM $DATABASE_USER;

GRANT CONNECT ON DATABASE $DATABASE_NAME
  TO $DATABASE_USER;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

GRANT ALL ON ALL TABLES IN SCHEMA public TO $DATABASE_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DATABASE_USER;
```
7. Use `\q` to exit the client.
1. Run `rm ~/.psql_history` to clear the client history (which contains the `$DATABASE_PASSWORD`).
1. Use `pg_restore` or other tools to add data to the database.

## Getting started in production

1. Connect to the database cluster as an admin user and run `CREATE DATABASE $DATABASE_NAME;` to create the database.
1. Connect to the database with `\connect $DATABASE_NAME`.
1. Run the queries from above to create the database user and set permissions. You should also do `REVOKE ALL` for the new user for each existing database and for each existing user on the new database.

## References

- There might be useful information in [the corresponding README for Naginata][2].

[2]: https://bitbucket.org/alexgs99/todo-ninja-naginata/src/develop/database/README.md
