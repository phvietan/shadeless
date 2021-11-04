import React from 'react';
import { Grid, useToast, Box, SkeletonText } from '@chakra-ui/react';

import ShowOrigins from 'pages/dashboard/show-origins';
import FuzzHeaderStatistic from './fuzz-header-stat';
import { ParsedPathApi, SiteMapMetadata, sitemapMetadataDefault } from 'libs/apis/parsed_paths';
import { useLocation } from 'wouter';
import { notify } from 'libs/notify';
import storage from 'libs/storage';

const parsedPathApiInstance = ParsedPathApi.getInstance();

function FuzzHeader () {
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
    <Grid
      gridTemplateColumns={['1fr', null, null, '1fr 3fr']}
      p="20px"
      px="2%"
      gap="20px"
    >
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
      <ShowOrigins
        isLoading={isLoading}
        origins={metadata.origins.filter(origin => origin !== '')}
      />
      <FuzzHeaderStatistic
        metadata={metadata}
        isLoading={isLoading}
      />
    </Grid>
  );
}

export default FuzzHeader;
