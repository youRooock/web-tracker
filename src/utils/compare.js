const compare = (a, b) => {
  if (a.elapsedTime > b.elapsedTime) {
    return -1;
  }
  if (a.elapsedTime < b.elapsedTime) {
    return 1;
  }
  return 0;
};


export default compare;
