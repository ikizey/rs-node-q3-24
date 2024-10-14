import { cp } from "./cp.js";
import { rm } from "./rm.js";

export const mv = async (args) => {
  const cpResult = await cp(args);
  if (!Array.isArray(cpResult)) {
    return false;
  }

  const [sourcePathname, destinationPathname] = cpResult;

  const rmResult = await rm([sourcePathname]);
  if (!rmResult) {
    await rm([destinationPathname]);
    return false;
  }

  return cpResult;
};
