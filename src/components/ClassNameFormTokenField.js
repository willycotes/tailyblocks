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
import "./ClassNameFormTokenField.css";
import { tailwindCSSClassNameUtilities } from "../tailwindCSSClassNameUtilities";
import {
	classNamesToArrayObject,
	addPrefixDeviceTypeClassName,
} from "../utils/utils";
import { useGlobalState } from "../hooks/useGlobalState";

const Keys = {
	TAB: 9,
	SPACE: 32,
	COMMA: 188,
	ENTER: 13,
};

const suggestions = tailwindCSSClassNameUtilities.map((country) => {
	return {
		id: country,
		text: country,
	};
});

/**
 * Component
 */
export default function TailwindReactTags(props) {
	const { attributes, setAttributes, deviceType } = props;
	const deviceTypeClassName = `${deviceType}ClassName`;
	console.log(attributes);
	console.log("deviceTypeClassName:", deviceTypeClassName);

	const isSaveable = useRef(false);
	console.log("isSaveable:", isSaveable.current);
	const { globalState, setGlobalState } = useGlobalState();
	console.log("globalState:", globalState);

	// const {
	// 	hasChangedClassName,
	// 	setHasChangedClassName,
	// 	hasChangedClassNameRef,
	// } = useContext(TailwindClassNameContext);

	function handleAddition(newClassName) {
		const updateClassName = {};
		updateClassName[deviceTypeClassName] = classnames(
			attributes[deviceTypeClassName] || "",
			addPrefixDeviceTypeClassName(newClassName.text, deviceType),
		).trim();
		console.log("updateClassName:", updateClassName);
		setAttributes({ ...updateClassName });
		console.log(
			"attributes[deviceTypeClassName]:",
			attributes[deviceTypeClassName],
		);
		setAttributes({ customClassName: "" });

		console.log(newClassName);

		if (!isSaveable.current) {
			isSaveable.current = true;
			setGlobalState({ hasChangedClassName: isSaveable.current });
		}
	}
	function handleDelete(i) {
		const updateClassName = {};

		console.log(i);
		const classNameArray = attributes[deviceTypeClassName].split(" ");
		classNameArray.splice(i, 1);
		updateClassName[deviceTypeClassName] = classNameArray.join(" ").trim();
		setAttributes({ ...updateClassName });

		if (!isSaveable.current) {
			isSaveable.current = true;
			setGlobalState({ hasChangedClassName: isSaveable.current });
		}
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
			tags={classNamesToArrayObject(attributes[deviceTypeClassName])}
		/>
	);
}
