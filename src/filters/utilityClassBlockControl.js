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
import UtilityClassToolbarDropdown from "../components/UtilityClassToolbarDropdown";

const utilityClassBlockControl = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		return (
			<>
				<BlockEdit {...props} />

				{props.isSelected && (
					<>
						<BlockControls {...props}>
							<ToolbarGroup>
								<UtilityClassToolbarDropdown {...props} />
							</ToolbarGroup>
						</BlockControls>
					</>
				)}
			</>
		);
	};
}, "utilityClassBlockControl");

addFilter(
	"editor.BlockEdit",
	"windpress/utilityClassBlockControl",
	utilityClassBlockControl,
);
