import React from 'react';
import { Box, SkeletonText, useToast } from '@chakra-ui/react';
import Navbar from './common/navbar';
import SiteMapTab from './sitemap/sitemap-tab';
import { PacketsApi } from 'libs/apis/packets';
import { notify } from 'libs/notify';
import { useLocation } from 'wouter';
import storage from 'libs/storage';

const packetApiInstance = PacketsApi.getInstance();

function SiteMap () {
  const toast = useToast();
  const setLocation = useLocation()[1];
  const [isLoading, setIsLoading] = React.useState(true);
  const [origins, setOrigins] = React.useState<string[]>([]);

  const getMetaData = async () => {
    const resp = await packetApiInstance.getMetaData();
    if (resp.statusCode === 404) {
      setLocation('/projects');
      notify(toast, { statusCode: 404, data: '', error: `Not found project ${storage.getProject()} in database` });
      return;
    }
    const result = resp.data;

    // Blacklist wappalyzer because it flood our page
    setOrigins(result.origins.filter(o => o !== 'https://ad.wappalyzer.com' && o !== ''));
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
      <Box
        mt="5vh"
        mx="4%"
        bg="background.primary-white"
      >
        {origins.map(origin =>
          <SiteMapTab
            key={`sitemaptab-${origin}`}
            origin={origin}
          />
        )}
      </Box>
    </Box>
  );
}

export default SiteMap;
