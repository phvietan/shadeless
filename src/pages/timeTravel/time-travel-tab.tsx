/* eslint-disable no-unused-vars */
import React from 'react';
import { Packet } from 'libs/apis/packets';
import { Box, Button, Grid, Link, Text } from '@chakra-ui/react';
import { FilesApi } from 'libs/apis/files';
import TimeTravelBody from './time-travel-body';
import { GenericApi } from 'libs/apis/types';
import storage from 'libs/storage';
import TimeTravelButton from './time-travel-button';
import { dateToString } from 'libs/timing';
import { notify, ToastType } from 'libs/notify';

const filesApiInstance = FilesApi.getInstance();

export enum TimeTravelBodyType {
  REQUEST_HEADER = 'time-travel-request-header',
  RESPONSE_HEADER = 'time-travel-response-header',
  REQUEST_BODY = 'time-travel-request-body',
  RESPONSE_BODY = 'time-travel-response-body',
};

type Props = {
  packet: Packet;
  toast: ToastType;
};
function TimeTravelTab (props: Props) {
  const { packet, toast } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [errRequest, setErrRequest] = React.useState<string>('');
  const [errResponse, setErrResponse] = React.useState<string>('');
  const [requestBody, setRequestBody] = React.useState<string>('');
  const [responseBody, setResponseBody] = React.useState<string>('');

  const getBodies = async () => {
    const [reqBody, errReq] = await filesApiInstance.getFileContentFromId(packet.requestBodyHash);
    const [resBody, errRes] = await filesApiInstance.getFileContentFromId(packet.responseBodyHash);
    setRequestBody(reqBody);
    if (errReq) setErrRequest(errReq.message);
    setResponseBody(resBody);
    if (errRes) setErrResponse(errRes.message);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getBodies();
  }, [packet]);

  const copy = async () => {
    const url = packet.origin + packet.requestHeaders[0].split(' ')[1];
    await navigator.clipboard.writeText(url);
    notify(toast, { statusCode: 200, data: 'Copied url to clipboard', error: '' });
  };

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
        <Grid gridTemplateColumns="1fr 1fr">
          <Text
            as="h2"
            color="white"
            p="10px"
            justifySelf="start"
          >
            Index: {packet.requestPacketIndex}
          </Text>
          <Text
            as="h2"
            fontStyle="italic"
            color="white"
            p="10px"
            float="right"
            justifySelf="end"
          >
            {dateToString(new Date(packet.created_at || 0))}
          </Text>
        </Grid>
      </Box>
      <Grid gridTemplateColumns="1fr 1fr">
        <TimeTravelBody
          bodyType={TimeTravelBodyType.REQUEST_HEADER}
          isLoading={false}
          reflectedParameters={packet.reflectedParameters}
          content={packet.requestHeaders.join('\n')}
        />
        <TimeTravelBody
          bodyType={TimeTravelBodyType.RESPONSE_HEADER}
          isLoading={false}
          reflectedParameters={packet.reflectedParameters}
          content={packet.responseHeaders.join('\n')}
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr">
        <Box p="10px" border="1px solid LightGray">
          <TimeTravelButton>{packet.codeName}</TimeTravelButton>
          <TimeTravelButton onClick={copy}>
            Copy URL
          </TimeTravelButton>
          <TimeTravelButton>
            Reflected parameters: {Object.keys(packet.reflectedParameters).length}
          </TimeTravelButton>
        </Box>
        <Box p="10px" border="1px solid LightGray">
          <Link
            href={`${GenericApi.backendUrl}/files/${storage.getProject()}/${packet.responseBodyHash}`}
            rel="nofollow noopener"
            target="_blank"
          >
            <TimeTravelButton>
              Download
            </TimeTravelButton>
          </Link>
        </Box>
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr">
        <TimeTravelBody
          error={errRequest}
          bodyType={TimeTravelBodyType.REQUEST_BODY}
          isLoading={isLoading}
          reflectedParameters={packet.reflectedParameters}
          content={requestBody}
        />
        <TimeTravelBody
          error={errResponse}
          bodyType={TimeTravelBodyType.RESPONSE_BODY}
          isLoading={isLoading}
          reflectedParameters={packet.reflectedParameters}
          content={responseBody}
        />
      </Grid>
    </Box>
  );
}

export default TimeTravelTab;
