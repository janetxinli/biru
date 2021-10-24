// get today's date formatted as YYYY-MM-DD
export const getToday = () => {
  const date = new Date();
  const dateStrings = date.toLocaleDateString().split("/");
  const orderedDateStrings = [dateStrings[2], ...dateStrings.splice(0, 2)];
  return orderedDateStrings.join("-");
};
