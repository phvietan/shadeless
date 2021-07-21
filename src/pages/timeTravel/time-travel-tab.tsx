import React from 'react';
import { Packet } from 'libs/apis/packets';
import { Box, Grid, SkeletonText, Text } from '@chakra-ui/react';
import { FilesApi } from 'libs/apis/files';

const filesApiInstance = FilesApi.getInstance();

type Props = {
  packet: Packet;
};
function TimeTravelTab (props: Props) {
  const { packet } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [requestBody, setRequestBody] = React.useState('');
  const [responseBody, setResponseBody] = React.useState('');

  const getBodies = async () => {
    const reqBody = await filesApiInstance.getFileContentFromId(packet.requestBodyHash);
    const resBody = await filesApiInstance.getFileContentFromId(packet.responseBodyHash);
    setRequestBody(reqBody);
    setResponseBody(resBody);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getBodies();
  }, []);

  return (
    <Box
      bg="background.primary-white"
      fontSize="sm"
      wordBreak="break-all"
      mt="4vh"
      color="background.primary-black"
      shadow="xs"
      borderRadius="5px"
      id={packet.requestPacketIndex.toString()}
    >
      <Box bg="background.primary-black">
        <Text
          as="h2"
          color="white"
          p="10px"
        >
          Index: {packet.requestPacketIndex}
        </Text>
      </Box>
      <Grid gridTemplateColumns="1fr 1fr">
        <Box
          p="3%"
          borderRight="1px solid LightGray"
          borderBottom="1px solid LightGray"
        >
          {packet.requestHeaders.map((header, index) =>
            <Text
              key={`req-header-${packet.requestPacketId}-${index}`}
              mt="1px"
            >
              {header}
            </Text>
          )}
        </Box>
        <Box
          p="3%"
          borderBottom="1px solid LightGray"
        >
          {packet.responseHeaders.map((header, index) =>
            <Text
              key={`resp-header-${packet.requestPacketId}-${index}`}
              mt="1px"
            >
              {header}
            </Text>
          )}
        </Box>
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr">
        <Box
          p="3%"
          borderRight="1px solid LightGray"
        >
          {isLoading &&
            <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
          }
          <Text as="p">
            {requestBody}
          </Text>
        </Box>

        <Box p="3%">
          {isLoading &&
            <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
          }
          <Text as="p">
            {responseBody}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}

export default TimeTravelTab;
