/**
 * WordPress dependencies
 */
import { useContext } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { GlobalStateContext } from "../context/GlobalStateContext";

export const useGlobalState = () => useContext(GlobalStateContext);
