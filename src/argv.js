const parseArgsValue = () => {
  const args = process.argv.slice(2);

  const argValue = getValidArgValue(args);
  if (!argValue) {
    printArgFormatMessage();
    process.exit(1);
  }

  return argValue;
};

export default parseArgsValue;

const printArgFormatMessage = () => {
  console.error("There must be one argument `--username=<your_username>`");
  console.error("example:\tnpm run start -- --username=johndoe");
  console.error('example:\tnpm run start -- --username="John Doe"');
};

const getValidArgValue = (args) => {
  if (args.length !== 1) {
    return null;
  }

  const firstArg = args[0];

  if (!isValidArg(firstArg)) {
    return null;
  }

  const argValue = firstArg.split("=")[1];
  if (!argValue) {
    return null;
  }

  return argValue;
};

const isValidArg = (arg) => {
  if (!arg) {
    return false;
  }

  return arg.startsWith("--username=");
};
