/**
 * Picks the country with the highest probability from the Nationalize API response.
 * @param {Array} countries - Array of objects: [{ country_id: 'US', probability: 0.1 }, ...]
 * @returns {Object|null} - The country object with the highest probability or null if empty.
 */
const getPrimaryCountry = (countries) => {
  // 1. Check if the array exists and has at least one item.
  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    return null; // This will help us trigger the 502 error later in the controller
  }

  // 2. Use reduce to find the object with the highest probability.
  // Note: We use 'probability' here because that is what the external API returns.
  return countries.reduce((highest, current) => {
    return current.probability > highest.probability ? current : highest;
  }, countries[0]);
};

module.exports = getPrimaryCountry;
/* 
Why we use countries[0] in the reduce:
By passing countries[0] as the second argument to .reduce(), we give the function a "starting point" to compare against. It says: "Assume the first country is the highest, then check if any of the others are bigger." 
If we didn't provide this initial value, .reduce() would start with the first two items in the array, which could lead to issues if the array is empty (hence the earlier check). By ensuring we have a valid starting point, we can safely find the country with the highest probability without worrying about edge cases.
 */
