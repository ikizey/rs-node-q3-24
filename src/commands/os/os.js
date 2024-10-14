import { cpus, EOL, homedir, userInfo, arch } from "node:os";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";
import { color } from "../../colors/colors.js";

export const os = (args) => {
  const argument = getValidArg(args);
  if (!argument) {
    printInputError();
    return false;
  }

  const subCommands = new Map([
    ["EOL", () => whiteLog(JSON.stringify(EOL))],
    ["cpus", () => printCpus()],
    ["homedir", () => whiteLog(homedir())],
    ["username", () => whiteLog(userInfo().username)],
    ["architecture", () => whiteLog(arch())],
  ]);

  try {
    subCommands.get(argument)();
  } catch {
    printOperationError();
    return false;
  }

  return true;
};

const getValidArg = (args) => {
  if (args.length !== 1) {
    return null;
  }
  const allowed = [
    "--EOL",
    "--cpus",
    "--homedir",
    "--username",
    "--architecture",
  ];
  if (!allowed.includes(args[0])) {
    return null;
  }

  return args[0].replace("--", "");
};

const printCpus = () => {
  const cpusInfo = cpus();
  console.log(
    `${color.primary}CPUs: ${color.secondary}${cpusInfo.length}${color.reset}`
  );
  cpusInfo.forEach((cpu, index) => {
    process.stdout.write(`${color.primary}[CPU ${index + 1}] `);
    process.stdout.write(`Model: ${color.white}${cpu.model} `);
    process.stdout.write(
      `${color.primary}Clock rate: ${color.white}${cpu.speed} GHz${color.reset}`
    );
    process.stdout.write("\n");
  });
};

const whiteLog = (text) => {
  console.log(`${color.white}${text}${color.reset}`);
};
