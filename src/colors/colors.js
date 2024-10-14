const colors = {
  white: "\x1b[37m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  reset: "\x1b[0m",
};

export const color = {
  ...colors,
  user: colors.white,
  primary: colors.yellow,
  secondary: colors.green,
  tertiary: colors.cyan,
  error: colors.red,
};
