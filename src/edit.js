/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from "@wordpress/block-editor";

import {
	TextControl,
	ToolbarDropdownMenu,
	ToolbarButton,
	ToolbarGroup,
	Dropdown,
	FormTokenField,
} from "@wordpress/components";

import { styles, copy, edit } from "@wordpress/icons";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({ className: attributes.customClassName });

	//console.log(blockProps.className);
	console.log(attributes.customClassName);
	console.log(attributes.test);
	function formatedValue(strg) {
		// Detecta si una cadena de texto tiene dos espacios al final
		//const regexp = /^.*\s\s$/;
		const regexp = /^\s+$/;
		if (
			strg === "" ||
			strg === undefined ||
			strg === null ||
			regexp.test(strg)
		) {
			console.log("El valor esta vacio");
			return [];
		}
		return strg.trim().split(" ");
		//if (regex.test(strg)) {
		//console.log("el texto tiene dos espacios al final");
		//return true;
		//}
	}

	return (
		<>
			<div {...blockProps}>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={styles}
							label="Estilos adicionales"
							controls={[
								{
									title: "Copy Styles",
									icon: copy,
									onClick: () => console.log("copy styles"),
								},
							]}
						></ToolbarDropdownMenu>
						<Dropdown
							className="custom-css-dropdown-wrapper"
							contentClassName="custom-css-dropdown-content"
							popoverProps={{ placement: "right-start" }}
							renderToggle={({ isOpen, onToggle }) => (
								<ToolbarButton
									icon={edit}
									label="Agregar estilos personalizados"
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							)}
							renderContent={() => (
								<>
									<TextControl
										label="Additional CSS Class"
										value={attributes.customClassName}
										onChange={function (value) {
											/*prettier-ignore*/

											setAttributes({ customClassName: value });
										}}
									/>
									<FormTokenField
										label="Type a continent"
										value={
											/*!!attributes.customClassName
												? attributes.customClassName.trim().split(" ")
												: []
												*/
											formatedValue(attributes.customClassName)
										}
										onChange={function (value) {
											setAttributes({ test: value });

											// Convierte un array en un string separado dividido por espacio
											setAttributes({ customClassName: value.join(" ") });
										}}
									/>
								</>
							)}
						/>
					</ToolbarGroup>
				</BlockControls>
				Texto de prueba
			</div>
		</>
	);
}
