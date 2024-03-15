/**
 * Register filter function modified block editor
 */

/**
 * Dependencies
 */
import { addFilter } from "@wordpress/hooks";

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
import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

/**
 * Used to filter the block settings when registering the block on the client with JavaScript.
 * bloques.registerBlockType (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype)
 */
function addCustomAttributes(settings, name) {
	settings.attributes = {
		...settings.attributes,
		...metadata.attributes,
	};
	return settings;
}

addFilter(
	"blocks.registerBlockType",
	"tailwindwp/tailwindwp",
	addCustomAttributes,
);

/**
 * Used to modify the block’s edit component.
 * editor.BlockEdit (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blockedit)
 *
 */
console.log("probando javascript enqueue");
