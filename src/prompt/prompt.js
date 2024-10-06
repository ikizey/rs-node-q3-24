import { color } from "../colors/colors.js";

export const printPrompt = () => {
  process.stdout.write(`${color.green}> ${color.reset}`);
};
