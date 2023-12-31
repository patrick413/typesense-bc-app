import React, { useState, useEffect, useRef } from 'react';
import { Flex, Grid, GridItem, Panel, Button, FlexItem, createAlertsManager, AlertProps, AlertsManager } from "@bigcommerce/big-design";
import { useChannel } from "@lib/hooks";
import { useConfig } from "context/config";
import { useSession } from "context/session";
import SideNav from "@components/sideNav";
import Loading from "@components/loading";
import ErrorMessage from "@components/error";
import StyleOption from "@components/tabPages/styleOption";
import SearchOption from "@components/tabPages/searchOption";

const alertsManager = createAlertsManager();

const Index = () => {
    const { searchConfig, searchId, updateConfig, updateID } = useConfig();
    const { error, isLoading, summary, mutateList } = useChannel();
    const encodedContext = useSession()?.context;
    const [activeTab, setActivePage] = useState([
        { name: "optional", isActive: true, caption:'Search Page Style' },
        { name: "search", isActive: false, caption:'Search Options' },
    ]);

    const valueRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      if (summary) {
        const parsedValue = JSON.parse(summary.value);
        valueRef.current = parsedValue;
        updateConfig(parsedValue);
        updateID(summary.id);
      } else {
        console.log("no data");
      }
    }
  }, [isLoading]);

    const template = `
        "nav  main" auto
        / 1fr 4.5fr;
    `;

    const alert: AlertProps = {
        header:'Changes Saved',
        messages: [{ text:'Please refresh sa the Storefront to see changes' }],
        type: 'success',
        onClose: () => null,
    };

    const handleSave = async () => {

        try {
            const updatedValue = {
                value: JSON.stringify(searchConfig),
            };

            await fetch(`/api/channels/${searchId}?context=${encodedContext}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedValue),
            });

            mutateList();
            alertsManager.clear();
            alertsManager.add(alert);
            setTimeout(() => {
                alertsManager.clear();
            }, 4000);
        } catch (error) {
            console.error('Error updating the config: ', error);
        }
    };

    const handleUpdate = (value) => {
        updateConfig(value);
    };

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
                    {!activeTab[0].isActive || <StyleOption searchConfig={searchConfig} updateHandler={handleUpdate} />}
                    {!activeTab[1].isActive || <SearchOption searchConfig={searchConfig} updateHandler={handleUpdate} />}
                </GridItem>
            </Grid>
            <Flex justifyContent="flex-end">
                <FlexItem marginTop="xxLarge">
                    <Button variant="secondary">Restore Defaults</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </FlexItem>
            </Flex>
        </Panel>
    );
};

export default Index;
