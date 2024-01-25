import { Paragraph, Button, Text } from '@contentful/f36-components';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const [title, setTitle] = useState(false);

  useEffect(() => {
    // Listen for changes on the title field
    const detach = sdk.entry.fields.title.onValueChanged((value) => {
      setTitle(value === undefined);
    });

    // Ensure field resizes automatically
    sdk.window.startAutoResizer();

    // Clean up the listener when the component is unmounted
    return () => detach();
  }, [sdk.window, sdk.entry.fields.title]);

  const handleClick = () => {
    sdk.entry.save();
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
