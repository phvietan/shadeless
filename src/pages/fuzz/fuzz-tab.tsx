import React from 'react';
import { FuzzStatus } from 'libs/apis/parsed_paths';
import { ParsedPacket } from 'libs/apis/packets';
import { Box, Text, Button, Tooltip, Link, Grid } from '@chakra-ui/react';
import { GenericApi } from 'libs/apis/types';

type Props = {
  api: ParsedPacket;
  updateScore: (api: ParsedPacket, newScore: number) => Promise<void>;
};
function FuzzTab (props: Props) {
  const { api, updateScore } = props;
  return (
    <Box
      border="1px solid LightGray"
      p="8px"
    >
      <Grid gridTemplateColumns="1fr 1fr">
        <Box>
          <Text>{api.origin}</Text>
          <Text fontSize="xs">{api.path}</Text>
          {api.parameters.map((param, index) =>
            <Button
              key={`${api.origin}/${api.path}/${param}/${index}`}
              size="xs"
              borderRadius="5px"
              m="2px"
              colorScheme={(param in api.reflectedParameters) ? 'green' : 'blackAlpha'}
            >
              {param}
            </Button>
          )}
          {api.status === FuzzStatus.DONE &&
            <Box>
              {api.result.length !== 0 &&
                <Text
                  fontSize="xs"
                  color="LawnGreen"
                >
                  Found: {api.result.length} bugs
                </Text>
              }
            </Box>
          }
        </Box>
        <Box justifySelf="end">
          {api.status === FuzzStatus.DONE &&
            <Tooltip label="See log">
              <Link
                href={`${GenericApi.backendUrl}/${api.logDir}`}
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
          {api.status === FuzzStatus.TODO &&
            <Tooltip label="Don't fuzz this api">
              <Button
                size="xs"
                bg="white"
                onClick={() => updateScore(api, 100)}
              >
                ❌
              </Button>
            </Tooltip>
          }
          {api.status === FuzzStatus.REMOVED &&
            <Tooltip label="Restore this api">
              <Button
                size="xs"
                bg="white"
                onClick={() => updateScore(api, 0)}
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

export default FuzzTab;
