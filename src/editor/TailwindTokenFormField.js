/**
 * Components
 */
import { FormTokenField } from "@wordpress/components";

export default function TailwindTokenFormField({ attributes, setAttributes }) {
	const { className } = attributes;

	function setCustomClassNamesInFormTokenField(value) {
		// Convierte un array en un string dividido por espacio
		setAttributes({ className: value.join(" ") });
	}

	console.log(className);

	return (
		<>
			<FormTokenField
				label="Type a continent"
				value={!!className ? className.trim().split(" ") : []}
				onChange={setCustomClassNamesInFormTokenField}
			/>
		</>
	);
}
