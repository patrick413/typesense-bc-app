import { useSession } from "context/session";
import SideNav from "@components/sideNav";
import { useChannel } from "@lib/hooks";
import { useState, useEffect, useRef } from "react";
import Loading from "@components/loading";
import ErrorMessage from "@components/error";
import { useConfig } from "context/config";
import {  Flex, Grid, GridItem, Panel, Button, FlexItem, createAlertsManager, AlertProps, AlertsManager } from "@bigcommerce/big-design";
import HitPerPage from "@components/tabPages/hitPerPage";
import SearchAttributes from "@components/tabPages/searchAttributes";


const alertsManager = createAlertsManager()
const Index = () => {
	
	const { searchConfig, searchId, updateConfig, updateID } = useConfig();
	const { error, isLoading, summary, mutateList } = useChannel()
	const encodedContext = useSession()?.context;
	const [activeTab, setActivePage] = useState([
		{ name: "optional", isActive: true, caption:'Hits Per Page' },
		{ name: "search", isActive: false, caption:'Searchable Attributes' },
	])

	const valueRef = useRef();
	useEffect(() => {
		if (!isLoading) {
			if (summary) {
				valueRef.current = JSON.parse(summary.value);
				updateConfig(valueRef.current);
				updateID(summary.id);
			} else {
				console.log("no data");
			}
		}
	}, [isLoading, summary, updateConfig, updateID]);
	const template = `
        "nav  main" auto
        / 1fr 4.5fr;
    `;
	const alert: AlertProps = {
		header:'Changes Saved',
		messages: [{ text:'Please refresh sa the Storefront to see changes' }],
		type: 'success',
		onClose: () => null,
	}
	const handleSave = async () => {
		try {
            const updatedValue = {
				value:JSON.stringify(searchConfig)
			}
			
            await fetch(`/api/channels/${searchId}?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedValue),
			});
			mutateList()
			alertsManager.clear();
			alertsManager.add(alert);
			setTimeout(() => {
				alertsManager.clear();
			}, 4000);
        } catch (error) {
            console.error('Error updating the config: ', error);
        }

	}
	const handleUpdate = (value) => {
		updateConfig(value)
	}
	const handleTabClick = (tabname) => {
		setActivePage((prevActiveTab) => {
		const updatedActiveTab = prevActiveTab.map((obj) => ({
			...obj,
			isActive: obj.name === tabname,
		}));

		updatedActiveTab.forEach((obj) => {
			if (obj.name !== tabname) {
			obj.isActive = false;
			}
		});

		return updatedActiveTab;
		});
	};
	if (isLoading) return <Loading />;
	if (error) return <ErrorMessage error={error} />;

	return (
		<Panel id="config">
			<AlertsManager manager={alertsManager} />
			<Grid gridTemplate={template} padding="large">
				<GridItem gridArea="nav">
					<SideNav tabChange={handleTabClick} activeTab={activeTab} />
				</GridItem>
				<GridItem gridArea="main" paddingLeft="large">
					{!activeTab[0].isActive || <HitPerPage searchConfig={searchConfig} updateHandler={handleUpdate } />}
					{!activeTab[1].isActive || <SearchAttributes searchConfig={searchConfig} updateHandler={handleUpdate} />}
				</GridItem>
			</Grid>
				<Flex
                justifyContent="flex-end"
                >
					<FlexItem marginTop = "xxLarge">
						<Button variant="secondary">Restore Defaults</Button>
						<Button variant="primary" onClick={handleSave}>Save Changes</Button>
					</FlexItem>
				</Flex>
		</Panel>
	);
};

export default Index;
