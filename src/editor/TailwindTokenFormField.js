/**
 * Components
 */
import { FormTokenField } from "@wordpress/components";

export default function TailwindTokenFormField({ attributes, setAttributes }) {
	const { customClassNames } = attributes;

	function setCustomClassNamesInFormTokenField(value) {
		// Convierte un array en un string dividido por espacio
		setAttributes({ customClassNames: value.join(" ") });
	}

	console.log(customClassNames);

	return (
		<>
			<FormTokenField
				label="Type a continent"
				value={!!customClassNames ? customClassNames.trim().split(" ") : []}
				onChange={setCustomClassNamesInFormTokenField}
			/>
		</>
	);
}
