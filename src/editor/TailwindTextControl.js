/**
 * Components
 */
import { TextControl } from "@wordpress/components";

export default function TailwindTextControl({ attributes, setAttributes }) {
	const { customClassNames } = attributes;

	function setCustomClassNamesInTextControl(value) {
		// Validación de espacios al principio del texto
		const regexp = /^\s+$/;
		if (regexp.test(value)) {
			console.log("se ha ingresado espacios al principio del texto");
			return;
		}
		// Validación de espacios al final del texto
		const regexp2 = /\s{2,}$/;
		if (regexp2.test(value)) {
			console.log("Se han dado dos espacio al final");
			return;
		}

		// Validar al dar espacios delante del texto

		setAttributes({ customClassNames: value });

		/* Hacer una validación para palabras repetidas cuando se haga un espacio luego de escribir la palabra 
		y cuando se cierre el toolbar control del bloque */
		const regexp3 = /\s$/;
		if (regexp3.test(value)) {
			console.log("Verificando...");
		}
	}

	return (
		<>
			<TextControl
				label="Additional CSS Class"
				value={customClassNames}
				onChange={setCustomClassNamesInTextControl}
			/>
		</>
	);
}
