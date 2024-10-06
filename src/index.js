import * as app from "./commands/index.js";
import printWelcomeMessage from "./welcome/welcome.js";
import { printPrompt } from "./prompt/prompt.js";
import os from "os";

function main() {
  printWelcomeMessage();

  process.chdir(os.homedir());

  process.on("SIGINT", () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    app.exit();
  });

  process.stdin.on("begin", () => printPrompt).on("data", app.execute);

  printPrompt();
}

main();
