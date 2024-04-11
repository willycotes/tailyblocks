/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState, useEffect, useRef, useContext } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { sendPostData } from "../utils/utils";
import { TailwindClassNameContext } from "../context/GlobalStateContext";

/**
 * Function component inspector editor
 */
export default function TailwindExecuteButton() {
	const isPostSavingInProgress = useRef(false);
	// const { hasChangedClassName, setHasChangedClassName } = useContext(
	// 	TailwindClassNameContext,
	// );
	const { hasChangedContent, isSavingPost, currentPost } = useSelect(
		(select) => {
			const store = select("core/editor");
			return {
				hasChangedContent: store.hasChangedContent(),
				isSavingPost: store.isSavingPost(),
				currentPost: store.getCurrentPost(),
			};
		},
		[],
	);
	console.log("hasChangedContent:", hasChangedContent);
	console.log("isSavingPost:", isSavingPost);

	const { savePost } = useDispatch("core/editor");

	const formData = new FormData();
	formData.append("action", "process_windpress_ajax_post_content");
	formData.append("nonce", windpressAJAX.nonce);
	formData.append("test", "hello work");
	formData.append("content", currentPost.content);
	formData.append("id", currentPost.id);
	formData.append("type", currentPost.type);

	// Set up options for the fetch request
	const options = {
		method: "POST",
		body: formData,
	};

	useEffect(() => {
		if (isSavingPost && !isPostSavingInProgress.current) {
			isPostSavingInProgress.current = true;
			console.log("isPostSavingInProgress:", isPostSavingInProgress.current);
		}
		if (!isSavingPost && isPostSavingInProgress.current) {
			sendPostData(windpressAJAX.ajax_url, options);
			isPostSavingInProgress.current = false;
			console.log("isPostSavingInProgress:", isPostSavingInProgress.current);
		}
	}, [isSavingPost]);

	const handleClick = () => {
		savePost();
	};

	return (
		<>
			<Button
				// disabled={!hasChangedClassName}
				variant="primary"
				onClick={handleClick}
			>
				Generate Styles
			</Button>
		</>
	);
}
