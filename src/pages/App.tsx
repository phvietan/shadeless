import React from 'react';
import Navbar from 'pages/navbar';
import { Box, SkeletonText } from '@chakra-ui/react';
import { defaultMetaData, PacketsApi } from 'libs/apis/packets';
import OriginTab from 'pages/dashboard/origin-tab';
import AppHeader from './dashboard/app-header';
import { useHashLocation } from 'libs/location.hook';

const packetApiInstance = PacketsApi.getInstance();

function AppPage () {
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewOrigins, setViewOrigins] = React.useState<string[]>([]);
  const [metaData, setMetaData] = React.useState(defaultMetaData);
  const currentLocation = useHashLocation();

  const getMetaData = async () => {
    const resp = await packetApiInstance.getMetaData();
    const result = resp.data;

    // Blacklist wappalyzer because it flood our page
    result.origins = result.origins.filter(o => o !== 'https://ad.wappalyzer.com' && o !== '');
    result.parameters = result.parameters.filter(p => p !== '');
    result.reflectedParameters = result.reflectedParameters.filter(p => p !== '');
    setMetaData(result);
    setViewOrigins(result.origins);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getMetaData();
  }, []);

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />

      <AppHeader metaData={metaData} isLoading={isLoading} />
      <Box px="2%">
        {isLoading &&
          <Box
            bg="background.primary-white"
            borderRadius="5px 0px"
          >
            <SkeletonText
              p="2%"
              noOfLines={5}
              spacing="4"
            />
          </Box>
        }
        {viewOrigins.map(origin =>
          <OriginTab
            key={`origintab-${origin}`}
            origin={origin}
            isFocus={currentLocation === origin}
          />
        )}
      </Box>
    </Box>
  );
}

export default AppPage;
