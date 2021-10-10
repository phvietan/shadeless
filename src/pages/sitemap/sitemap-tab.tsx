import React from 'react';
import { ParsedPath, ParsedPathApi } from 'libs/apis/parsed_paths';
import SiteMapTabHeader from './sitemap-tab-header';
import { fromParsedPathsToSiteMapObject, SiteMapObject, siteMapObjectDefault } from './sitemap-object';
import { SkeletonText } from '@chakra-ui/skeleton';
import SiteMapTree from './sitemap-tree';
import { Box } from '@chakra-ui/layout';

const parsedPathsApiInstance = ParsedPathApi.getInstance();

type Props = {
  origin: string;
};
function SiteMapTab (props: Props) {
  const { origin } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [structure, setStructure] = React.useState<SiteMapObject>(siteMapObjectDefault);
  const [parsedPaths, setParsedPaths] = React.useState<ParsedPath[]>([]);

  React.useEffect(() => {
    const getParsedPaths = async () => {
      const resp = await parsedPathsApiInstance.getCurrentProjectParsedPathByOrigin(origin);
      setIsLoading(false);
      setParsedPaths(resp.data);
      console.log(origin, resp.data);
    };
    getParsedPaths();
  }, []);

  React.useEffect(() => {
    const s = fromParsedPathsToSiteMapObject(parsedPaths);
    setStructure(s);
  }, [parsedPaths]);

  return (
    <Box
      my="50px"
    >
      <SiteMapTabHeader
        id={`sitemap-${origin}`}
        origin={origin}
        numPaths={parsedPaths.length}
      />

      {isLoading && <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />}
      <Box
        p="10px"
      >
        <SiteMapTree
          tree={structure}
        />
      </Box>

    </Box>
  );
}

export default SiteMapTab;
