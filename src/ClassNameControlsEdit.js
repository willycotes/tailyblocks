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
	ToolbarButton,
	ToolbarGroup,
	Dropdown,
	FormTokenField,
	PanelBody,
	PanelRow,
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
export default function ClassNameControlsEdit({ attributes, setAttributes }) {
	const { customClassNames } = attributes;

	const setCustomClassNamesInTextControl = (value) => {
		// Validación de espacios al principio del texto
		const regexp = /^\s+$/;
		if (regexp.test(value)) {
			console.log("se ha ingresado espacios al principio del texto");
			return;
		}
		// Validación de espacios al final del texto
		const regexp2 = /\s{2,}$/;
		if (regexp2.test(value)) {
			console.log("Se han dado dos espacio al final");
			return;
		}

		// Validar al dar espacios delante del texto

		setAttributes({ customClassNames: value });

		/* Hacer una validación para palabras repetidas cuando se haga un espacio luego de escribir la palabra 
		y cuando se cierre el toolbar control del bloque */
		const regexp3 = /\s$/;
		if (regexp3.test(value)) {
			console.log("Verificando...");
		}
	};

	const setCustomClassNamesInFormTokenField = (value) => {
		// Convierte un array en un string dividido por espacio
		setAttributes({ customClassNames: value.join(" ") });
	};

	console.log(customClassNames);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						className="classname-control-dropdown"
						contentClassName="classname-control-dropdown-content"
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
									value={customClassNames}
									onChange={setCustomClassNamesInTextControl}
								/>
								<FormTokenField
									label="Type a continent"
									value={
										!!customClassNames ? customClassNames.trim().split(" ") : []
									}
									onChange={setCustomClassNamesInFormTokenField}
								/>
							</>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
}
