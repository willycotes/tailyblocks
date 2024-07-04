/**
 * External dependencies
 */
import classnames from "classnames";
import { WithContext as ReactTags } from "react-tag-input";

/**
 * WordPress dependencies
 */
import { useState, useRef } from "@wordpress/element";

/**
 * Internal dependencies
 */
import "./UtilityClassFormTokenField.css";
import { tailwindcssUtilityClasses } from "../tailwindcssUtilityClassList";
import {
	utilityClassToObject,
	addDeviceTypePrefixToClassName,
} from "../utils/utils";

const Keys = {
	TAB: 9,
	SPACE: 32,
	COMMA: 188,
	ENTER: 13,
};

const suggestions = tailwindcssUtilityClasses.map((country) => {
	return {
		id: country,
		text: country,
	};
});

/**
 * Component add Tailwind class name utilities
 */
const UtilityClassFormTokenField = (props) => {
	const { attributes, setAttributes, deviceType } = props;

	console.log(attributes);

	/**
	 * Constante que guarda el nombre del atributo registrado en la configuración del bloque y que
	 * está destinado en guardar los nombres de clases personalizadas dependiendo del tamaño de la
	 * pantalla
	 * @constant
	 */
	const deviceTypeClassNameAttribute = `${deviceType.toLowerCase()}ClassName`;

	console.log(deviceTypeClassNameAttribute);

	const handleAddition = (newClassName) => {
		/* Creando objeto que representará el atributo correspondiente en la configuración del bloque */
		const attribute = {};
		/* Agregando prefijo de Tailwindcss a el nombre de la clase según el tipo de pantalla */
		newClassName = addDeviceTypePrefixToClassName(
			newClassName.text,
			deviceType,
		);

		console.log("classname:", newClassName);

		/* Guardando todas las clases correspondientes en una constante */
		const classNames = classnames(
			attributes[deviceTypeClassNameAttribute] || "",
			newClassName,
		).trim();

		/* Guardando las clases en mi atributo personalizado que representa a el atributo correspondiente en la configuración del bloque */
		attribute[deviceTypeClassNameAttribute] = classNames;
		console.log("custom attribute", attribute);

		/* Actualizando el atributo de nombre de clases correspondiente */
		setAttributes({ ...attribute });

		console.log(attributes[deviceTypeClassNameAttribute]);

		/* Reseteando el atributo que va guardando el nombre a medida que la vamos tecleando */
		setAttributes({ customClassName: "" });

		// console.log("classname:", newClassName);
	};

	function handleDelete(i) {
		const updateClassName = {};

		console.log(i);
		const classNameArray = attributes[deviceTypeClassNameAttribute].split(" ");
		classNameArray.splice(i, 1);
		updateClassName[deviceTypeClassNameAttribute] = classNameArray
			.join(" ")
			.trim();
		setAttributes({ ...updateClassName });
	}

	function handleInputChange(value) {
		setAttributes({ customClassName: value });
	}

	function handleInputBlur() {
		setAttributes({ customClassName: "" });
	}

	function handleFilterSuggestions(query, suggestions) {
		// Ordenar las sugerencias según su relevancia (en este caso, no se ordenarán)
		const sortedSuggestions = suggestions;

		// Filtrar las primeras 20 sugerencias ordenadas por coincidencia con la consulta
		const filtered = sortedSuggestions
			.filter(
				(item) => item.text.toLowerCase().indexOf(query.toLowerCase()) === 0,
			)
			.slice(0, 20);

		return filtered;
	}

	return (
		<ReactTags
			delimiters={[Keys.ENTER, Keys.COMMA, Keys.SPACE, Keys.TAB]}
			// editable={true}
			allowUnique={true}
			inputFieldPosition="top"
			allowDeleteFromEmptyInput={false}
			placeholder={`Type ${deviceType} class name here`}
			autocomplete={true}
			suggestions={suggestions}
			autofocus={false}
			handleAddition={handleAddition}
			handleDelete={handleDelete}
			handleInputChange={handleInputChange}
			handleInputBlur={handleInputBlur}
			handleFilterSuggestions={handleFilterSuggestions}
			tags={utilityClassToObject(attributes[deviceTypeClassNameAttribute])}
		/>
	);
};

export default UtilityClassFormTokenField;
