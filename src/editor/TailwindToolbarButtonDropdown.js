/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * Components
 */
import { Dropdown, ToolbarButton } from "@wordpress/components";
import TailwindTextControl from "./TailwindTextControl";
import TailwindTokenFormField from "./TailwindTokenFormField";
import TailwindExecuteButton from "./TailwindExecuteButton";
import TailwindIcon from "./TailwindIcon";

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
						<TailwindTextControl {...props} />
						<TailwindTokenFormField {...props} />
						<TailwindExecuteButton />
					</>
				)}
			/>
		</>
	);
}
