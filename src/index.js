import * as app from "./commands/index.js";
import printWelcomeMessage from "./welcome/welcome.js";
import { printPrompt } from "./prompt/prompt.js";

function main() {
  printWelcomeMessage();

  process.on("SIGINT", () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    app.exit();
  });

  process.stdin.on("begin", () => printPrompt).on("data", app.execute);

  printPrompt();
}

main();
