import parseArgsValue from "../argv/argv.js";

const printWelcomeMessage = () => {
  const username = parseArgsValue();
  console.log(`Welcome to the File Manager, ${username}!`);
};

export default printWelcomeMessage;
