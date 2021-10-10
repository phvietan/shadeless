import React from 'react';
import { Grid } from '@chakra-ui/react';

import ShowOrigins from 'pages/dashboard/show-origins';
import SiteMapHeaderStatistic from './sitemap-header-stat';
import { SiteMapMetadata } from './sitemap-object';

type Props = {
  metadata: SiteMapMetadata;
  isLoading: boolean;
};
function SiteMapHeader (props: Props) {
  const { metadata, isLoading } = props;
  return (
    <Grid
      gridTemplateColumns={['1fr', null, null, '2fr 3fr']}
      p="20px"
      px="2%"
      gap="20px"
    >
      <ShowOrigins
        isLoading={isLoading}
        origins={metadata.origins.filter(origin => origin !== '')}
      />
      <SiteMapHeaderStatistic
        metadata={metadata}
        isLoading={isLoading}
      />
    </Grid>
  );
}

export default SiteMapHeader;
