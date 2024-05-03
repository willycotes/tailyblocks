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
	const { initialPreviewDeviceType } = useSelect((select) => {
		return {
			initialPreviewDeviceType:
				select("core/edit-post").__experimentalGetPreviewDeviceType(),
		};
	}, []);
	const { __experimentalSetPreviewDeviceType } = useDispatch("core/edit-post");

	const [tabNameSelected, setTabNameSelected] = useState(
		initialPreviewDeviceType.toLowerCase(),
	);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		__experimentalSetPreviewDeviceType(firstChartCapitalize(tabNameSelected));
		console.log("useEffect ejecutandose");
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
						name: "mobile",
						title: "Mobile",
						icon: <Icon icon={mobile} />,
					},
					{
						name: "tablet",
						title: "Tablet",
						icon: <Icon icon={tablet} />,
					},
					{
						name: "desktop",
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
