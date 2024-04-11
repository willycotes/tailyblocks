/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { addFilter } from "@wordpress/hooks";

/**
 * Used to filter the block settings when registering the block on the client with JavaScript.
 * bloques.registerBlockType (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype)
 */
const addAttributes = (settings, name) => {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			customClassName: {
				type: "string",
			},
			mobileClassName: {
				type: "string",
			},
			tabletClassName: {
				type: "string",
			},
			desktopClassName: {
				type: "string",
			},
		},
	};
};

addFilter(
	"blocks.registerBlockType",
	"windpress/classNameControls",
	addAttributes,
);

function saveClassName(extraProps, blockType, attributes) {
	let addedCustomClass = false;
	if (!addedCustomClass) {
		// Add the custom class
		extraProps.className = classnames(
			extraProps.className || "",
			attributes.mobileClassName || "",
			attributes.tabletClassName || "",
			attributes.desktopClassName || "",
		);

		// Set a flag to prevent adding the class again.
		addedCustomClass = true;
	}

	return extraProps;
}

addFilter(
	"blocks.getSaveContent.extraProps",
	"windpress/saveClassName",
	saveClassName,
);
