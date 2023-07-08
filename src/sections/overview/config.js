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
