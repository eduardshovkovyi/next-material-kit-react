export const convertBoxesData = (array) => {
  return array?.length && array[0].map((_, i) => array.map((row) => row[i]));
};
