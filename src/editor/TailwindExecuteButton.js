/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * Custom components editor
 */
import { Button } from "@wordpress/components";
import { useSelect, useDispatch, select, dispatch } from "@wordpress/data";

/**
 * Function component inspector editor
 */
export default function TailwindExecuteButton() {
	const sendPostData = async (ajaxURL, options) => {
		try {
			const response = await fetch(ajaxURL, options);
			if (!response.ok) {
				const errorText = await response.text();
				console.error("Error en la respuesta del servidor:", errorText);
				throw new Error(`Error del servidor (${response.status}): ${errorText}`);
			}
			const data = await response.json();
			console.log("Respuesta exitosa:", data);
			return data;
		} catch (error) {
			if (error.name === "TypeError") {
				console.error("Error de red o CORS:", error.message);
			} else {
				console.error("Error inesperado:", error.message);
			}
			throw error;
		}
	};

	const handleClick = async () => {
		if (select("core/editor").isEditedPostEmpty()) {
			return;
		}

		if (select("core/editor").isEditedPostSaveable()) {
			await dispatch("core/editor").savePost();
		}

		const post = select("core/editor").getCurrentPost();
		console.log(post);

		const formData = new FormData();
		formData.append("action", "process_tailyblocks_ajax_post_content");
		formData.append("nonce", tailyblocksAJAX.nonce);
		formData.append("content", post.content);
		formData.append("id", post.id);
		formData.append("type", post.type);

		// Set up options for the fetch request
		const options = {
			method: "POST",
			body: formData,
		};

		sendPostData(tailyblocksAJAX.ajax_url, options);
	};
	return (
		<>
			<Button variant="primary" onClick={handleClick}>
				Generate Styles
			</Button>
		</>
	);
}
