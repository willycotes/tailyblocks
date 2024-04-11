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
import TailwindClassNameControlsPanel from "../components/ClassNameControlsPanel";

/**
 * Used to modify the block’s edit component.
 * editor.BlockEdit (https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blockedit)
 *
 */

const tailwindClassNameInspectorControl = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			// 	select("core/edit-post").__experimentalGetPreviewDeviceType();
			return (
				<>
					<BlockEdit {...props} />

					{props.isSelected && (
						<>
							<InspectorControls {...props}>
								<PanelBody title="Tailwind CSS class name utilities">
									<PanelRow>
										<TailwindClassNameControlsPanel {...props} />
									</PanelRow>
								</PanelBody>
							</InspectorControls>
						</>
					)}
				</>
			);
		};
	},
	"tailwindClassNameInspectorControl",
);

addFilter(
	"editor.BlockEdit",
	"windpress/tailwindClassNameInspectorControl",
	tailwindClassNameInspectorControl,
);
