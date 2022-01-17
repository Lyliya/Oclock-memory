// group by https://stackoverflow.com/a/47385953
Array.prototype.groupBy = function (key) {
  return this.reduce(
    (hash, obj) => ({
      ...hash,
      [obj[key]]: (hash[obj[key]] || []).concat(obj)
    }),
    {}
  );
};
