import React from 'react';
import Navbar from 'pages/navbar';
import { Grid, Box, Button } from '@chakra-ui/react';
import { defaultMetaData, PacketsApi } from 'libs/apis/packets';
import ShowOrigins from 'pages/dashboard/show-origins';
import ShowParameters from 'pages/dashboard/show-parameters';
import OriginTab from 'pages/dashboard/origin-tab';

const packetApiInstance = PacketsApi.getInstance();

function AppPage () {
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewOrigins, setViewOrigins] = React.useState<string[]>([]);
  const [metaData, setMetaData] = React.useState(defaultMetaData);

  const getMetaData = async () => {
    const resp = await packetApiInstance.getMetaData();
    const result = resp.data;

    // Blacklist wappalyzer because it flood our page
    result.origins = result.origins.filter(o => o !== 'https://ad.wappalyzer.com' && o !== '');
    result.parameters = result.parameters.filter(p => p !== '');
    result.reflectedParameters = result.reflectedParameters.filter(p => p !== '');
    setMetaData(result);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getMetaData();
  }, []);
  React.useEffect(() => {
    setViewOrigins(metaData.origins.slice(0, 10));
  }, [metaData]);

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <Box
      bg="background.primary-grey"
    >
      <Navbar />
      <Grid
        gridTemplateColumns={['1fr', null, null, '2fr 3fr']}
        p="20px"
        px="5%"
        gap="20px"
      >
        <ShowOrigins
          origins={metaData.origins.filter(origin => origin !== '')}
        />
        <ShowParameters
          parameters={metaData.parameters}
          reflectedParameters={metaData.reflectedParameters}
        />
      </Grid>

      <Box
        px="5%"
      >
        {viewOrigins.map(origin =>
          <OriginTab
            key={`origintab-${origin}`}
            origin={origin}
          />
        )}
      </Box>

      {viewOrigins.length !== metaData.origins.length &&
        <Button
          w="90%"
          ml="5%"
          mb="10vh"
          colorScheme="purple"
        >
          More
        </Button>
      }

    </Box>
  );
}

export default AppPage;
