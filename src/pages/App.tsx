import React from 'react';
import Navbar from 'pages/navbar';
import { Grid, Box } from '@chakra-ui/react';
import { defaultMetaData, PacketsApi } from 'libs/apis/packets';
import ShowOrigins from 'pages/dashboard/show-origins';
import ShowParameters from 'pages/dashboard/show-parameters';

const packetApiInstance = PacketsApi.getInstance();

function AppPage () {
  const [isLoading, setIsLoading] = React.useState(true);
  const [metaData, setMetaData] = React.useState(defaultMetaData);

  const getMetaData = async () => {
    const resp = await packetApiInstance.getMetaData();
    setMetaData(resp.data);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getMetaData();
  }, []);

  if (isLoading) return <h1>dcm</h1>;

  return (
    <Box
      bg="background.primary-grey"
    >
      <Navbar />
      <Grid
        gridTemplateColumns={['1fr', '1fr 1fr']}
        p="20px"
        px="5%"
        gap="20px"
      >
        <ShowOrigins
          origins={metaData.origins.filter(origin => origin !== '')}
        />
        <ShowParameters
          parameters={metaData.parameters.filter(param => param !== '')}
          reflectedParameters={metaData.reflectedParameters.filter(param => param !== '')}
        />
      </Grid>
    </Box>
  );
}

export default AppPage;
