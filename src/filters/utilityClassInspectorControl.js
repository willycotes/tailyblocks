/**
 * WordPress dependencies
 */
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow } from "@wordpress/components";

/**
 * Internal dependencies
 */
import UtilityClassControlsPanel from "../components/UtilityClassControlsPanel";

/**
 * Used to modify the block’s edit component.
 * editor.BlockEdit (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blockedit)
 *
 */

const utilityClassInspectorControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		return (
			<>
				<BlockEdit {...props} />

				{props.isSelected && (
					<>
						<InspectorControls {...props}>
							<PanelBody title="Tailwind CSS class name utilities">
								<PanelRow>
									<UtilityClassControlsPanel {...props} />
								</PanelRow>
							</PanelBody>
						</InspectorControls>
					</>
				)}
			</>
		);
	};
}, "utilityClassInspectorControl");

addFilter(
	"editor.BlockEdit",
	"windpress/utilityClassInspectorControl",
	utilityClassInspectorControl,
);
