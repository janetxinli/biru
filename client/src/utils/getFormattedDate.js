// get a date formatted as YYYY-MM-DD
const getFormattedDate = (date = null) => {
  let oldDate;
  if (!date) {
    oldDate = new Date();
  } else {
    oldDate = new Date(date);
  }

  const dateStrings = oldDate.toLocaleDateString().split("/");
  const orderedDateStrings = [
    dateStrings[2],
    ...dateStrings.splice(0, 2).map((d) => d.padStart(2, "0")),
  ];
  return orderedDateStrings.join("-");
};

export default getFormattedDate;
