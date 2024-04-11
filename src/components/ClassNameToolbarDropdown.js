/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	Dropdown,
	ToolbarButton,
	Panel,
	PanelRow,
} from "@wordpress/components";

/**
 * Internal dependencies
 */
import TailwindIcon from "./TailwindIcon";
import PreviewDeviceTabPanel from "./ClassNameControlsPanel";
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function TailwindToolbarButtonDropdown(props) {
	return (
		<>
			<Dropdown
				className="classname-control-dropdown"
				contentClassName="classname-control-dropdown-content"
				popoverProps={{ placement: "right-start" }}
				renderToggle={({ isOpen, onToggle }) => (
					<ToolbarButton
						icon={TailwindIcon}
						label="Agregar estilos personalizados"
						onClick={onToggle}
						aria-expanded={isOpen}
					/>
				)}
				renderContent={() => (
					<>
						<Panel header="Tailwind CSS class name utilities">
							<PanelRow>
								<PreviewDeviceTabPanel {...props} />
							</PanelRow>
						</Panel>
					</>
				)}
			/>
		</>
	);
}
