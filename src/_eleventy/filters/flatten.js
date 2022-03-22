/**
 * Flatten nested object into array of objects that contain matching property
 * @param {object} object
 * @param {string} property
 * @returns {array}
 */
const flatten = (object, property) => {
	let flattened = [];

	Object.keys(object).forEach( key => {
		const childObject = object[key];

		if(childObject[property]) {
			flattened.push(childObject);
		}
		else {
			flattened = flattened.concat(flatten(childObject, property));
		}
	});

	return flattened;
};

module.exports = flatten;
