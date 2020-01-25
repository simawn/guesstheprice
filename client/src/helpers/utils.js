/**
 * Generates a random alphanumeric string on predefined length.
 *
 * @param {Number} length Random string length
 * @returns A random string of predefined length
 */
export let genRandomString = length => {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1);
};

/**
 * Check if string is alphanumeric
 * @param {String} ch
 */
export const isAlphaNumeric = ch => {
  return ch.match(/^[a-z0-9]+$/i) !== null;
};
