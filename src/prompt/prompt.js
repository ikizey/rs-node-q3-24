import { color } from "../colors/colors.js";

export const printPrompt = () => {
  console.log(
    `${color.primary}You are currently in ${color.secondary}${process.cwd()}${
      color.primary
    }${color.reset}`
  );
  process.stdout.write(`${color.green}> ${color.reset}`);
};
