const parseArgs = () => {
  const args = process.argv.slice(2);
  const prefix = "--";

  for (let i = 0; i < args.length; i += 2) {
    const argKey = args[i].replace(prefix, "");
    const argValue = args[i + 1];
    console.log(`${argKey} is ${argValue}`);
  }
};

parseArgs();
