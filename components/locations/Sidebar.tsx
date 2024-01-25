import { Paragraph, Button, Text } from '@contentful/f36-components';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from 'contentful-management';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const [title, setTitle] = useState(false);
  const [rawData, setRawData] = useState<any>();
  const entryId = sdk.entry.getSys().id;

  // Access Content Management API with credentials
  const cma = useMemo(
    () =>
      createClient(
        { apiAdapter: sdk.cmaAdapter },
        {
          type: 'plain',
          defaults: {
            environmentId: sdk.ids.environmentAlias ?? sdk.ids.environment,
            spaceId: sdk.ids.space,
          },
        }
      ),
    [
      sdk.cmaAdapter,
      sdk.ids.environmentAlias,
      sdk.ids.environment,
      sdk.ids.space,
    ]
  );

  useEffect(() => {
    // Get current entry data with entryId
    const fetchData = async () => {
      try {
        const data = await cma.entry.get({ entryId });
        setRawData(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Check if cma.entry and entryId are truthy
    cma.entry && entryId && fetchData();
  }, [cma.entry, entryId]);

  useEffect(() => {
    // Listen for changes on the title field
    const detach = sdk.entry.fields.title.onValueChanged((value) => {
      setTitle(value === undefined);
    });

    // Clean up the listener when the component is unmounted
    return () => detach();
  }, [sdk.entry.fields.title]);

  useEffect(() => {
    // Ensure field resizes automatically
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  const handleClick = () => {
    cma.entry
      .update({ entryId }, rawData)
      .then((entry) => {
        console.log(entry);
        console.log(`Entry ${entry.sys.id} updated.`);
      })
      .catch((error) => {
        console.error('Error updating entry:', error);
      });
  };

  return (
    <>
      <Button
        variant='secondary'
        isFullWidth
        onClick={handleClick}
        isDisabled={title}
      >
        Start Build
      </Button>
      <Paragraph marginBottom='none' marginTop='spacingS'>
        <Text fontColor='gray700'>
          Click and wait 15 min to preview Draft articles.
        </Text>
      </Paragraph>
    </>
  );
};

export default Sidebar;
