/**
 * Convierte la primera letra de una palabra en mayúscula
 */
export function firstChartCapitalize(text) {
	return text[0].toUpperCase() + text.slice(1);
}

/**
 * Convierte un string en un array de objetos compatible con el componente ReactTags
 * @param {string} className
 */
export function classNamesToArrayObject(className) {
	return !!className
		? className.split(" ").map((value) => {
				return {
					id: value,
					text: value,
				};
		  })
		: [];
}

/**
 * Agrega un prefijo de Tailwind CSS a un nombre de clase según el tipo de pantalla
 *
 * @param {string} className Nombre de la clase CSS para agregar el prefijo
 * @param {string} deviceType Preview device type
 * @returns {string}
 */
export function addPrefixDeviceTypeClassName(className, deviceType) {
	if (deviceType === "tablet") {
		return `md:${className}`;
	}
	if (deviceType === "desktop") {
		return `lg:${className}`;
	}
	return className;
}

/**
 *
 */
export const sendPostData = (ajaxURL, options) => {
	// Make the fetch request with the provided options
	fetch(ajaxURL, options)
		.then((response) => {
			// Check if the request was successful
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			// Parse the response as JSON
			return response.json();
		})
		.then((data) => {
			// Handle the JSON data
			console.log(data);
		})
		.catch((error) => {
			// Handle any errors that occurred during the fetch
			console.error("Fetch error:", error);
		});
};
