import { spawn } from "node:child_process";
import path from "node:path";

const spawnChildProcess = async (args) => {
  const scriptPath = path.join("src", "cp", "files", "script.js");
  const errorMessage = "Failed to spawn child process";

  const argsArray = args || [];

  try {
    spawn("node", [scriptPath, ...argsArray], {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
    }).on("spawn", () => {
      console.log("type CLOSE to exit");
    });
  } catch (error) {
    throw new Error(errorMessage);
  }
};

// Put your arguments in function call to test this functionality
spawnChildProcess( /* [someArgument1, someArgument2, ...] */);
