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
export function utilityClassToObject(className) {
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
 * Agrega un prefijo CSS Tailwind a un nombre de clase según el tamaño de la pantalla.
 *
 * Esta función toma un nombre de clase CSS base y antepone un prefijo de Tailwindcss que
 * corresponde al tipo de pantalla especificado. Esto es útil para aplicar estilos responsivos
 * dinámicamente. Los tipos de pantalla pueden ser entre 'Desktop', 'Tablet' o 'Mobile'.
 *
 * @param {string} className El nombre de la clase CSS base al que se le asignará el prefijo.
 * @param {string} deviceType Tipo de pantalla
 * @returns {string}
 */
export function addDeviceTypePrefixToClassName(className, deviceType) {
	if (deviceType === "Tablet") {
		return `md:${className}`;
	}
	if (deviceType === "Desktop") {
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
