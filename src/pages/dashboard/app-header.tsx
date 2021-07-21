import React from 'react';
import { Grid } from '@chakra-ui/react';

import ShowOrigins from 'pages/dashboard/show-origins';
import ShowParameters from 'pages/dashboard/show-parameters';
import { MetaData } from 'libs/apis/packets';

type Props = {
  metaData: MetaData;
  isLoading: boolean;
};
function AppHeader (props: Props) {
  const { metaData, isLoading } = props;
  return (
    <Grid
      gridTemplateColumns={['1fr', null, null, '2fr 3fr']}
      p="20px"
      px="2%"
      gap="20px"
    >
      <ShowOrigins
        isLoading={isLoading}
        origins={metaData.origins.filter(origin => origin !== '')}
      />
      <ShowParameters
        isLoading={isLoading}
        parameters={metaData.parameters}
        reflectedParameters={metaData.reflectedParameters}
      />
    </Grid>
  );
}

export default AppHeader;
