/**
 * Register filter function modified block editor
 */

/**
 * Dependencies
 */
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";

/**
 * Internal dependencies
 */
import ClassNameControlsEdit from "./ClassNameControlsEdit";
import metadata from "./block.json";
import { settings } from "@wordpress/icons";

// Utilities
import classnames from "classnames";

/**
 * Used to filter the block settings when registering the block on the client with JavaScript.
 * bloques.registerBlockType (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype)
 */
const addCustomAttributes = (settings, name) => {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			...metadata.attributes,
		},
	};
};

addFilter(
	"blocks.registerBlockType",
	"tailwindwp/classNameControls",
	addCustomAttributes,
);

/**
 * Used to modify the block’s edit component.
 * editor.BlockEdit (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blockedit)
 *
 */
const classNameControlsToolbarAndSidebar = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			return (
				<>
					<BlockEdit {...props} />
					{props.isSelected && <ClassNameControlsEdit {...props} />}
				</>
			);
		};
	},
	"classNameControlsToolbarAndSidebar",
);

addFilter(
	"editor.BlockEdit",
	"tailwindwp/classNameControls",
	classNameControlsToolbarAndSidebar,
);

const defineCustomClassName = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		return (
			<BlockListBlock
				{...props}
				className={classnames(
					props.className || "",
					props.attributes.customClassNames,
				)}
			/>
		);
	};
}, "defineCustomClassName");

addFilter(
	"editor.BlockListBlock",
	"my-plugin/with-client-id-class-name",
	defineCustomClassName,
);

function addCustomClassInFront(extraProps, blockType, attributes) {
	let addedCustomClass = false;
	if (!addedCustomClass) {
		// Add the custom class
		extraProps.className = classnames(
			extraProps.className || "",
			attributes.customClassNames || "",
		);

		// Set a flag to prevent adding the class again.
		addedCustomClass = true;
	}

	return extraProps;
}

addFilter(
	"blocks.getSaveContent.extraProps",
	"my-plugin/add-custom-class",
	addCustomClassInFront,
);
console.log("script executing...");
