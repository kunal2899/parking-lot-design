const { isArray, every } = require("lodash")

const validateValue = (value, instance) => {
  if (isArray(value) && every(value, (value) => value instanceof instance))
    return true;

  if (value instanceof instance) return true;

  return false;
};

module.exports = {
  validateValue,
}