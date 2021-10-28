// get a date formatted as YYYY-MM-DD
export const getFormattedDate = (date=null) => {
  console.log(date);
  let oldDate;
  if (!date) {
    oldDate = new Date();
  } else {
    oldDate = new Date(date);
  }

  const dateStrings = oldDate.toLocaleDateString().split("/");
  const orderedDateStrings = [dateStrings[2], ...dateStrings.splice(0, 2)];
  return orderedDateStrings.join("-");
};
