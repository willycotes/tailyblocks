/**
 * WordPress dependencies
 */
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup } from "@wordpress/components";

/**
 * Internal dependencies
 */
import ClassNameToolbarDropdown from "../components/ClassNameToolbarDropdown";

const classNameBlockControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		// 	select("core/edit-post").__experimentalGetPreviewDeviceType();
		return (
			<>
				<BlockEdit {...props} />

				{props.isSelected && (
					<>
						<BlockControls {...props}>
							<ToolbarGroup>
								<ClassNameToolbarDropdown {...props} />
							</ToolbarGroup>
						</BlockControls>
					</>
				)}
			</>
		);
	};
}, "classNameBlockControl");

addFilter(
	"editor.BlockEdit",
	"windpress/classNameBlockControl",
	classNameBlockControl,
);
