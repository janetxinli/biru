export const capitalize = (string) => {
  if (typeof string !== "string") {
    throw Error("Input must be a string");
  }

  return string.slice(0, 1).toUpperCase() + string.slice(1);
};
