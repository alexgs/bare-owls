// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
require('dotenv').config({ path: '../.env' });

import chalk from 'chalk';
import * as env from 'env-var';
import shell from 'shelljs';

interface ComposeProjectData {
  Name: string;
  Status: string;
}

type ComposeProjectList = ComposeProjectData[];

const DB = {
  NAME: env.get('DATABASE_NAME').required().asString(),
  PASSWORD: env.get('DATABASE_PASSWORD').required().asString(),
  PORT: env.get('DATABASE_PORT').required().asPortNumber(),
  URL: '',
  USER: env.get('DATABASE_USER').required().asString(),
};
DB.URL = `postgresql://${DB.USER}:${DB.PASSWORD}@localhost:${DB.PORT}/${DB.NAME}`;
const REQUIRED_COMMANDS = ['docker-compose', 'psql'];
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

  console.log('Hello database backups!');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
