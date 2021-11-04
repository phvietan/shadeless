import React from 'react';
import Navbar from './common/navbar';
import SiteMapTab from './sitemap/sitemap-tab';
import SiteMapHeader from './sitemap/sitemap-header';
import { ParsedPathApi, ParsedPath, FuzzStatus } from 'libs/apis/parsed_paths';
import { notify } from 'libs/notify';
import { Box, Text, Grid, useToast } from '@chakra-ui/react';

const parsedPathsApiInstance = ParsedPathApi.getInstance();

type SiteMapSectionProps = {
  msg: string;
  title: string;
  paths: ParsedPath[];
  restorePaths: () => any;
}
function SiteMapSection (props: SiteMapSectionProps) {
  const { msg, title, paths, restorePaths } = props;

  const toast = useToast();
  const updateStatus = async (parsedPath: ParsedPath, status: FuzzStatus) => {
    const parsedPathApiInstance = ParsedPathApi.getInstance();
    const resp = await parsedPathApiInstance.updateStatus(parsedPath, status);
    notify(toast, resp);
    restorePaths();
  };

  return (
    <Box
      bg="background.primary-white"
      p="10px"
      my="30px"
      mx="2%"
      boxShadow="md"
    >
      <Text as="h1" fontSize="4xl"> {title} </Text>
      <Grid
        gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
        gap="10px"
        border="1px solid LightGray"
      >
        {paths.map(p =>
          <SiteMapTab
            parsedPath={p}
            key={`sitemap-tab-${p.id}`}
            updateStatus={updateStatus}
          />
        )}
      </Grid>
      {paths.length === 0 && <Text as="i">{msg}</Text>}
    </Box>
  );
}

function SiteMap () {
  const [fuzzedPaths, setFuzzedPaths] = React.useState<ParsedPath[]>([]);
  const [todoPaths, setTodoPaths] = React.useState<ParsedPath[]>([]);
  const [removedPaths, setRemovedPaths] = React.useState<ParsedPath[]>([]);
  // const [scanningPaths, setScanningPaths] = React.useState<ParsedPath[]>([]);

  const getPaths = async () => {
    const { data } = await parsedPathsApiInstance.getParsedPaths();
    setFuzzedPaths(data.done);
    setTodoPaths(data.todo);
    setRemovedPaths(data.removed);
    // setScanningPaths(a.scanning);
  };
  React.useEffect(() => {
    getPaths();
  }, []);
  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <SiteMapHeader />

      <SiteMapSection
        title="Fuzzed paths"
        msg="No fuzzed path yet, have you run the bot?"
        restorePaths={getPaths}
        paths={fuzzedPaths}
      />
      <SiteMapSection
        title="To do paths"
        msg="No path in database to fuzz"
        restorePaths={getPaths}
        paths={todoPaths}
      />
      <SiteMapSection
        title="Removed paths"
        msg="Have not removed any path"
        restorePaths={getPaths}
        paths={removedPaths}
      />

    </Box>
  );
}

export default SiteMap;
