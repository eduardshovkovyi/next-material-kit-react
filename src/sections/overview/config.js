export const convertBoxesData = (array) => {
  return array?.length && array[0].map((_, i) => array.map((row) => row[i]));
};

export const formatData = (data) => {
  const dataCopy = [...data];
  const headers = dataCopy.shift();

  const formattedData = headers.map((header, i) => {
    return {
      name: header,
      data: dataCopy.map((row) => parseFloat(row[i]) || 0),
    };
  });

  return formattedData;
};

export const removeFirstElementsAndFormat = (arr) => {
  return arr.slice(1).map((innerArr) => innerArr.slice(1).map(Number));
};

export const checkAllZeros = (arr) => {
  return arr.every((num) => num === 0);
};

export const getCategories = (data) => {
  const newSourceArray = data.slice(1);
  return newSourceArray.map((item) => item[0]);
};
