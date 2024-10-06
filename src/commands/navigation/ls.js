import fs from "fs/promises";
import { color } from "../../colors/colors.js";
import { printOperationError } from "../../messages/operationError.js";

export const ls = async () => {
  const currentDir = process.cwd();
  try {
    const items = await fs.readdir(currentDir, { withFileTypes: true });

    items.sort(sortItems);

    const nameWidth = getMaxNameLength(items);
    const typeWidth = "directory".length;

    printHeader(nameWidth, typeWidth);

    printItems(items, nameWidth, typeWidth);
    return items.length;
  } catch {
    printOperationError();
    return false;
  }
};

const sortItems = (a, b) => {
  if (a.isDirectory() && !b.isDirectory()) return -1;
  if (!a.isDirectory() && b.isDirectory()) return 1;

  return a.name.localeCompare(b.name);
};

const getMaxNameLength = (items) => {
  return Math.max(...items.map((item) => item.name.length), "Name".length);
};

const printHeader = (nameWidth, typeWidth) => {
  console.log(`${color.cyan}${"Name".padEnd(nameWidth)} Type${color.reset}`);
  console.log("-".repeat(nameWidth + typeWidth + 1));
};

const printItems = (items, nameWidth, typeWidth) => {
  items.forEach((item) => {
    const coloredName = `${color.white}${item.name.padEnd(nameWidth)}${
      color.reset
    }`;
    const coloredType = item.isDirectory()
      ? `${color.blue}directory${color.reset}`
      : `${color.magenta}file${color.reset}`;
    console.log(`${coloredName} ${coloredType.padEnd(typeWidth)}`);
  });
};
