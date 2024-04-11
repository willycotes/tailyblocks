/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { GlobalStateContext } from "./GlobalStateContext";

export default function GlobalStateProvider({ children }) {
	const [globalState, setGlobalState] = useState({});
	return (
		<GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
			{children}
		</GlobalStateContext.Provider>
	);
}
