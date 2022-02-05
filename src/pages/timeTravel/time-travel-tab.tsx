/* eslint-disable no-unused-vars */
import React from 'react';
import { ParsedPacket } from 'libs/apis/packets';
import { Box, Grid, Text } from '@chakra-ui/react';
import { FilesApi } from 'libs/apis/files';
import TimeTravelBody from './time-travel-body';
import { dateToString } from 'libs/timing';
import { ToastType } from 'libs/notify';
import { Note } from 'libs/apis/notes';
import TimeTravelActionRow from './time-travel-action-row';

const filesApiInstance = FilesApi.getInstance();

export enum TimeTravelBodyType {
  REQUEST_HEADER = 'time-travel-request-header',
  RESPONSE_HEADER = 'time-travel-response-header',
  REQUEST_BODY = 'time-travel-request-body',
  RESPONSE_BODY = 'time-travel-response-body',
};

function getFirstLineRequestHeader(packet: ParsedPacket): string {
  let { path } = packet;
  if (packet.querystring !== '') path += `?${packet.querystring}`;
  return `${packet.method} ${path} ${packet.requestHttpVersion}`;
}

type Props = {
  packet: ParsedPacket;
  note?: Note;
  toast: ToastType;
  clickNote: (packet: ParsedPacket, note?: Note) => void;
};
function TimeTravelTab (props: Props) {
  const { packet, toast, note, clickNote } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [errRequest, setErrRequest] = React.useState<string>('');
  const [errResponse, setErrResponse] = React.useState<string>('');
  const [requestBody, setRequestBody] = React.useState<string>('');
  const [responseBody, setResponseBody] = React.useState<string>('');

  const [requestHeaders, setRequestHeaders] = React.useState<string[]>([]);

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
    setRequestHeaders([
      getFirstLineRequestHeader(packet),
      ...packet.requestHeaders,
    ]);
  }, [packet]);

  return (
    <Box
      bg="background.primary-white"
      fontSize="xs"
      wordBreak="break-all"
      mt="4vh"
      color="background.primary-black"
      shadow="xs"
      borderRadius="5px"
      id={packet.requestPacketIndex.toString()}
      name={packet.requestPacketId}
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
          content={requestHeaders.join('\n')}
        />
        <TimeTravelBody
          bodyType={TimeTravelBodyType.RESPONSE_HEADER}
          isLoading={false}
          reflectedParameters={packet.reflectedParameters}
          content={packet.responseHeaders.join('\n')}
        />
      </Grid>

      <TimeTravelActionRow
        note={note}
        toast={toast}
        packet={packet}
        body={requestBody}
        clickNote={clickNote}
      />

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
