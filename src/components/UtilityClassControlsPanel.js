/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from "@wordpress/data";
import {
	useState,
	useEffect,
	useRef,
	useContext,
	createContext,
} from "@wordpress/element";
import { TabPanel, PanelRow, Icon } from "@wordpress/components";
import { mobile, tablet, desktop } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import GenerateStylesButton from "./GenerateCSSButton";
import UtilityClassFormTokenField from "./UtilityClassFormTokenField";
import { firstChartCapitalize } from "../utils/utils";

/**
 *
 * Component Preview device type at tab control
 */
export default function UtilityClassControlsPanel(props) {
	const isFirstRender = useRef(true);

	const { initialDeviceType } = useSelect((select) => {
		return {
			initialDeviceType: select("core/editor").getDeviceType(),
		};
	}, []);

	const { setDeviceType } = useDispatch("core/editor");

	const [tabNameSelected, setTabNameSelected] = useState(
		// initialDeviceType.toLowerCase(),
		initialDeviceType,
	);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		// setDeviceType(firstChartCapitalize(tabNameSelected));

		setDeviceType(tabNameSelected);

		// console.log("useEffect ejecutandose");
	}, [tabNameSelected]);

	return (
		<>
			<TabPanel
				onSelect={(tabName) => {
					setTabNameSelected(tabName);
				}}
				initialTabName={tabNameSelected}
				tabs={[
					{
						name: "Mobile",
						title: "Mobile",
						icon: <Icon icon={mobile} />,
					},
					{
						name: "Tablet",
						title: "Tablet",
						icon: <Icon icon={tablet} />,
					},
					{
						name: "Desktop",
						title: "Desktop",
						icon: <Icon icon={desktop} />,
					},
				]}
				children={(tab) => {
					return (
						<>
							<PanelRow>
								<UtilityClassFormTokenField {...props} deviceType={tab.name} />
							</PanelRow>
							<PanelRow>
								<GenerateStylesButton {...props} />
							</PanelRow>
						</>
					);
				}}
			/>
		</>
	);
}
