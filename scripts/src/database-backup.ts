import shell from 'shelljs';

const requiredCommands = ['docker-compose', 'psql'];

async function main() {
  const missingCommands = requiredCommands
    .map((command) => {
      if (shell.which(command)) {
        return undefined;
      } else {
        return command;
      }
    })
    .filter((command) => !!command);
  if (missingCommands.length === 0) {
    console.log('All required commands are present.');
  } else {
    console.log(`The following commands are missing: ${missingCommands.join(', ')}`);
    shell.exit(2);
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
