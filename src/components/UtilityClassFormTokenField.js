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
import { tailwindcssUtilityClasses } from "../tailwindcssUtilityClasses";
import {
	utilityClassToObject,
	addPrefixClassNameDeviceType,
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
export default function UtilityClassFormTokenField(props) {
	const { attributes, setAttributes, deviceType } = props;
	const deviceTypeClassName = `${deviceType}ClassName`;
	console.log(attributes);
	console.log("deviceTypeClassName:", deviceTypeClassName);

	function handleAddition(newClassName) {
		const updateClassName = {};
		updateClassName[deviceTypeClassName] = classnames(
			attributes[deviceTypeClassName] || "",
			addPrefixClassNameDeviceType(newClassName.text, deviceType),
		).trim();
		console.log("updateClassName:", updateClassName);
		setAttributes({ ...updateClassName });
		console.log(
			"attributes[deviceTypeClassName]:",
			attributes[deviceTypeClassName],
		);
		setAttributes({ customClassName: "" });

		console.log(newClassName);
	}
	function handleDelete(i) {
		const updateClassName = {};

		console.log(i);
		const classNameArray = attributes[deviceTypeClassName].split(" ");
		classNameArray.splice(i, 1);
		updateClassName[deviceTypeClassName] = classNameArray.join(" ").trim();
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
			tags={utilityClassToObject(attributes[deviceTypeClassName])}
		/>
	);
}
