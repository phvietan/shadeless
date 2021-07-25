import React from 'react';
import { Packet } from 'libs/apis/packets';
import { Box, Grid, Text } from '@chakra-ui/react';
import { FilesApi } from 'libs/apis/files';
import TimeTravelBody from './time-travel-body';

const filesApiInstance = FilesApi.getInstance();

type Props = {
  packet: Packet;
};
function TimeTravelTab (props: Props) {
  const { packet } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [requestBody, setRequestBody] = React.useState<string>('');
  const [responseBody, setResponseBody] = React.useState<string>('');

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
        <TimeTravelBody
          isLoading={false}
          reflectedParameters={packet.reflectedParameters}
          content={packet.requestHeaders.join('\n')}
        />
        <TimeTravelBody
          isLoading={false}
          reflectedParameters={packet.reflectedParameters}
          content={packet.responseHeaders.join('\n')}
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr">
        <TimeTravelBody
          isLoading={isLoading}
          reflectedParameters={packet.reflectedParameters}
          content={requestBody}
        />
        <TimeTravelBody
          isLoading={isLoading}
          reflectedParameters={packet.reflectedParameters}
          content={responseBody}
        />
      </Grid>
    </Box>
  );
}

export default TimeTravelTab;
