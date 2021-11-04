import React from 'react';
import { FuzzStatus, ParsedPath } from 'libs/apis/parsed_paths';
import { Box, Text, Button, Tooltip, Link, Grid } from '@chakra-ui/react';
import { GenericApi } from 'libs/apis/types';

type Props = {
  parsedPath: ParsedPath;
  updateStatus: (parsedPath: ParsedPath, status: FuzzStatus) => Promise<void>;
};
function SiteMapTab (props: Props) {
  const { parsedPath, updateStatus } = props;
  return (
    <Box
      border="1px solid LightGray"
      p="8px"
    >
      <Grid gridTemplateColumns="1fr 1fr">
        <Box>
          <Text>{parsedPath.origin}</Text>
          <Text fontSize="xs">{parsedPath.path}</Text>
          {parsedPath.status === FuzzStatus.DONE &&
            <Box>
              {parsedPath.result.length !== 0 &&
                <Text
                  fontSize="xs"
                  color="LawnGreen"
                >
                  Found: {parsedPath.result.length} new paths
                </Text>
              }
              {parsedPath.error !== '' &&
                <Text
                  fontSize="xs"
                  color="FireBrick"
                >
                  Error: {parsedPath.error}
                </Text>
              }
            </Box>
          }
        </Box>
        <Box justifySelf="end">
          {parsedPath.status === FuzzStatus.DONE &&
            <Tooltip label="See log">
              <Link
                href={`${GenericApi.backendUrl}/${parsedPath.logDir}`}
                rel="nofollow noopener"
                target="_blank"
              >
                <Button
                  size="xs"
                  colorScheme="green"
                >
                  📑
                </Button>
              </Link>
            </Tooltip>
          }
          {parsedPath.status === FuzzStatus.TODO &&
            <Tooltip label="Don't fuzz this path">
              <Button
                size="xs"
                bg="white"
                onClick={() => updateStatus(parsedPath, FuzzStatus.REMOVED)}
              >
                ❌
              </Button>
            </Tooltip>
          }
          {parsedPath.status === FuzzStatus.REMOVED &&
            <Tooltip label="Restore this path">
              <Button
                size="xs"
                bg="white"
                onClick={() => updateStatus(parsedPath, FuzzStatus.TODO)}
              >
                ✔️
              </Button>
            </Tooltip>
          }
        </Box>
      </Grid>

    </Box>
  );
}

export default SiteMapTab;
