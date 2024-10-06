import parseArgsValue from "../argv/argv.js";
import { color } from "../colors/colors.js";

const printWelcomeMessage = () => {
  const username = parseArgsValue();

  console.log(
    `${color.primary}Welcome to the File Manager, ${color.user}${username}${color.primary}!\n${color.reset}`
  );
};

export default printWelcomeMessage;
