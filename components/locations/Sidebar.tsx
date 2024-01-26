import { Paragraph, Button, Text } from '@contentful/f36-components';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from 'contentful-management';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const entryId = sdk.entry.getSys().id;
  const isPublished = sdk.entry.getSys().publishedCounter !== 0;

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
    // Listen for changes on the field
    const detach = sdk.entry.fields.title.onValueChanged(() => {
      setIsDisabled(true);
      isPublished ? setIsLoading(false) : setIsLoading(true);

      // Ensure field is auto saved (CTF triggers auto-save every 5 seconds)
      setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    });

    // Clean up the listener when the component is unmounted
    return () => detach();
  }, [sdk.entry.fields.title, isPublished]);

  useEffect(() => {
    const detach = sdk.entry.fields.permalink.onValueChanged((value) => {
      setIsDisabled(!value);
      isPublished ? setIsLoading(false) : setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    });

    return () => detach();
  }, [sdk.entry.fields.permalink, isPublished]);

  useEffect(() => {
    // Ensure field resizes automatically
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  const handleClick = () => {
    cma.entry
      .get({ entryId })
      .then((entry) => {
        return cma.entry.update({ entryId }, entry);
      })
      .then((updatedEntry) => {
        console.log(`Entry ${updatedEntry.sys.id} updated.`);
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
        isDisabled={isPublished || isDisabled}
        isLoading={isLoading}
      >
        Start Build
      </Button>

      {!isPublished && (
        <Paragraph marginBottom='none' marginTop='spacingS'>
          <Text fontColor='gray700'>
            Use for new entries or when &apos;permalink&apos; changes. Wait 15
            min to see in Live Preview.
          </Text>
        </Paragraph>
      )}
    </>
  );
};

export default Sidebar;
