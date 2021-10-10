import React from 'react';
import { Box, SkeletonText, useToast } from '@chakra-ui/react';
import Navbar from './common/navbar';
import SiteMapTab from './sitemap/sitemap-tab';
import { notify } from 'libs/notify';
import { useLocation } from 'wouter';
import storage from 'libs/storage';
import { SiteMapMetadata, sitemapMetadataDefault } from './sitemap/sitemap-object';
import { ParsedPathApi } from 'libs/apis/parsed_paths';
import SiteMapHeader from './sitemap/sitemap-header';

const parsedPathApiInstance = ParsedPathApi.getInstance();

function SiteMap () {
  const toast = useToast();
  const setLocation = useLocation()[1];
  const [isLoading, setIsLoading] = React.useState(true);
  const [metadata, setMetadata] = React.useState<SiteMapMetadata>(sitemapMetadataDefault);

  const getMetaData = async () => {
    const resp = await parsedPathApiInstance.getMetaData();
    if (resp.statusCode === 404) {
      setLocation('/projects');
      notify(toast, { statusCode: 404, data: '', error: `Not found project ${storage.getProject()} in database` });
      return;
    }
    const result = resp.data;
    // Blacklist wappalyzer because it flood our page
    result.origins = result.origins.filter(o => o !== 'https://ad.wappalyzer.com' && o !== '');

    setMetadata(result);
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
      <SiteMapHeader
        isLoading={isLoading}
        metadata={metadata}
      />

      <Box
        mt="5vh"
        mx="2%"
        bg="background.primary-white"
      >
        {metadata.origins.map(origin =>
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
