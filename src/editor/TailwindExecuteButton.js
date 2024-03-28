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
import apiFetch from "@wordpress/api-fetch";
import { useState } from "@wordpress/element";
import axios from "axios";

/**
 * Function component inspector editor
 */
export default function TailwindExecuteButton() {
	const sendPostData = (ajaxURL, options) => {
		// Make the fetch request with the provided options
		fetch(ajaxURL, options)
			.then((response) => {
				// Check if the request was successful
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				// Parse the response as JSON
				return response.json();
			})
			.then((data) => {
				// Handle the JSON data
				console.log(data);
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("Fetch error:", error);
			});
	};

	const handleClick = async () => {
		if (select("core/editor").isEditedPostEmpty()) {
			return;
		}

		if (select("core/editor").isEditedPostSaveable()) {
			await dispatch("core/editor").savePost();
		}

		const post = select("core/editor").getCurrentPost();
		// console.log(post);

		const formData = new FormData();
		formData.append("action", "process_tailwindwp_ajax_post_content");
		formData.append("nonce", tailwindwpAJAX.nonce);
		formData.append("test", "hello work");
		formData.append("content", post.content);
		formData.append("id", post.id);
		formData.append("type", post.type);

		// Set up options for the fetch request
		const options = {
			method: "POST",
			body: formData,
		};

		sendPostData(tailwindwpAJAX.ajax_url, options);
		// console.log(data);
		// console.log(tailwindwpAJAX);
	};
	return (
		<>
			<Button variant="primary" onClick={handleClick}>
				Generate Styles
			</Button>
		</>
	);
}
