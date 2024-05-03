/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";

const utilityClassBlockList = createHigherOrderComponent((BlockListBlock) => {
	return (props) => {
		return (
			<BlockListBlock
				{...props}
				className={classnames(
					props.className || "",
					props.attributes.customClassName,
					props.attributes.mobileClassName || "",
					props.attributes.tabletClassName || "",
					props.attributes.desktopClassName || "",
				)}
			/>
		);
	};
}, "utilityClassBlockList");

addFilter(
	"editor.BlockListBlock",
	"windpress/utilityClassBlockList",
	utilityClassBlockList,
);
