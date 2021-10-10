import React from 'react';
import TabHeader from 'pages/common/tab-header';
import { Text } from '@chakra-ui/react';

type Props = {
  id: string,
  origin: string,
  numPaths: number,
}
function SiteMapTabHeader (props: Props) {
  const { id, origin, numPaths } = props;
  return (
    <TabHeader id={id}>
      <Text as="h2">
        {origin}
      </Text>

      <Text as="h2" justifySelf="end">
        {numPaths} paths
      </Text>
    </TabHeader>
  );
}

export default SiteMapTabHeader;
