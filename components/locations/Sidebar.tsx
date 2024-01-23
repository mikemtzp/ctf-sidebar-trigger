import { Paragraph, Button, Text } from '@contentful/f36-components';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useEffect } from 'react';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();

  // Ensure field resizes automatically
  useEffect(() => sdk.window.startAutoResizer(), [sdk.window]);

  return (
    <>
      <Button variant='primary' isFullWidth>
        Generate Build
      </Button>
      <Paragraph marginBottom='none' marginTop='spacingS'>
        <Text fontColor='gray700'>(AppId: {sdk.ids.app})</Text>
      </Paragraph>
    </>
  );
};

export default Sidebar;
