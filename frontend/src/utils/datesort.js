export const datesort = (array) => {
  array.sort((a, b) => {
    var c = new Date(a.createdAt);
    var d = new Date(b.createdAt);
    return d - c;
  });
  return array;
};
