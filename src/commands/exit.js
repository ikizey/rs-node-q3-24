import parseArgsValue from "../argv/argv.js";
import { color } from "../colors/colors.js";

export const exit = () => {
  const username = parseArgsValue();
  console.log(
    `${color.primary}Thank you for using File Manager, ${color.user}${username}${color.primary}, goodbye!${color.reset}`
  );
  process.exit(0);
};

