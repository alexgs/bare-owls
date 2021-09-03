// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
require('dotenv').config({ path: '../.env' });

import chalk from 'chalk';
import * as env from 'env-var';
import path from 'path';
import shell from 'shelljs';

interface ComposeProjectData {
  Name: string;
  Status: string;
}

type ComposeProjectList = ComposeProjectData[];

const PROJECT_ROOT = path.resolve(__dirname, '../..');

const DB = {
  NAMES: [env.get('DATABASE_NAME').required().asString(), 'fusionauth'],
  PORT: env.get('DATABASE_PORT').required().asPortNumber(),
  USER: env.get('DATABASE_USER').required().asString(),
};
const PATHS = {
  BACKUP_DIR: path.resolve(PROJECT_ROOT, 'host/database/backup'),
  PGPASS: path.resolve(PROJECT_ROOT, '.pgpass'),
};
const REQUIRED_COMMANDS = ['docker-compose', 'pg_dump'];
const TEXT = {
  ERROR: chalk.bgWhiteBright.red.bold(' >> ERROR << '),
  INFO: chalk.cyan('-- Info    --'),
  WARNING: chalk.keyword('orange').bold('<< Warning >>'),
};

// eslint-disable-next-line @typescript-eslint/require-await
async function main() {
  const missingCommands = REQUIRED_COMMANDS.map((command) => {
    if (shell.which(command)) {
      return undefined;
    } else {
      return command;
    }
  }).filter((command) => !!command);
  if (missingCommands.length === 0) {
    console.log(TEXT.INFO, 'All required commands are present.');
  } else {
    console.log(
      TEXT.ERROR,
      `The following commands are missing: ${missingCommands.join(', ')}`,
    );
    shell.exit(2);
  }

  // For details on PG password file, see https://www.postgresql.org/docs/current/libpq-pgpass.html
  if (!shell.test('-e', PATHS.PGPASS)) {
    console.log(
      TEXT.ERROR,
      `The password file ${PATHS.PGPASS} is missing. Exiting.`,
    );
    shell.exit(4);
  }

  const composeProjectsJson = shell.exec('docker-compose ls --format json', {
    silent: true,
  });
  const composeProjects = JSON.parse(composeProjectsJson) as ComposeProjectList;
  const targetProject = composeProjects.find(
    (data) => data.Name === 'bare-owls',
  );
  if (targetProject?.Status.startsWith('running')) {
    console.log(TEXT.INFO, 'Found Docker Compose project.');
  } else {
    console.log(
      TEXT.WARNING,
      'Docker Compose project "Bare Owls" is not currently running. Exiting.',
    );
    shell.exit(0);
  }

  shell.mkdir('-p', PATHS.BACKUP_DIR);
  DB.NAMES.forEach((database) => {
    const backup =
      `PGPASSFILE=${PATHS.PGPASS} pg_dump --host=localhost ` +
      `-p ${DB.PORT} -U ${DB.USER} -w ` +
      `${database} > ${path.join(PATHS.BACKUP_DIR, `${database}.sql`)}`;
    shell.exec(backup);
  });

  console.log(TEXT.INFO, 'Backup complete');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
