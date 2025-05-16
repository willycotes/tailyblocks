/**
 * Register filter function modified block editor
 */

/**
 * Dependencies
 */
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, BlockControls } from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * Internal dependencies
 */
// import metadata from "./block.json";

// Utilities
import classnames from "classnames";

/**
 * Components editor
 */
import TailwindToolbarButtonDropdown from "./editor/TailwindToolbarButtonDropdown";
import TailwindExecuteButton from "./editor/TailwindExecuteButton";

/**
 * Components
 */
import { ToolbarGroup, PanelBody, PanelRow } from "@wordpress/components";
import TailwindTextControl from "./editor/TailwindTextControl";
import TailwindTokenFormField from "./editor/TailwindTokenFormField";

/**
 * Used to filter the block settings when registering the block on the client with JavaScript.
 * bloques.registerBlockType (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype)
 */
const addCustomAttributes = (settings, name) => {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			customClassNames: {
				type: "string",
			},
		},
	};
};

addFilter(
	"blocks.registerBlockType",
	"tailyblocks/TailwindToolbarButtonDropdown",
	addCustomAttributes,
);

/**
 * Used to modify the block’s edit component.
 * editor.BlockEdit (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blockedit)
 *
 */
const TailwindToolbarButtonDropdownToolbarAndSidebar =
	createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			return (
				<>
					<BlockEdit {...props} />

					{props.isSelected && (
						<>
							<BlockControls {...props}>
								<ToolbarGroup>
									<TailwindToolbarButtonDropdown {...props} />
								</ToolbarGroup>
							</BlockControls>
							<InspectorControls {...props}>
								<PanelBody title="TailyBlocks">
									<PanelRow>
										<TailwindTextControl {...props} />
									</PanelRow>
									<PanelRow>
										<TailwindTokenFormField {...props} />
									</PanelRow>
									<PanelRow>
										<TailwindExecuteButton {...props} />
									</PanelRow>
								</PanelBody>
							</InspectorControls>
						</>
					)}
				</>
			);
		};
	}, "TailwindToolbarButtonDropdownToolbarAndSidebar");

addFilter(
	"editor.BlockEdit",
	"tailyblocks/TailwindToolbarButtonDropdown",
	TailwindToolbarButtonDropdownToolbarAndSidebar,
);

const defineCustomClassName = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		return (
			<BlockListBlock
				{...props}
				className={classnames(
					props.className || "",
					props.attributes.className,
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
			attributes.className || "",
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
