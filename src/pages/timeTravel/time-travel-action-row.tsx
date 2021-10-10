import React from 'react';
import { Button } from '@chakra-ui/button';
import { Box, Grid, Link } from '@chakra-ui/layout';
import { ParsedPacket } from 'libs/apis/packets';
import { GenericApi } from 'libs/apis/types';
import storage from 'libs/storage';
import { notify, ToastType } from 'libs/notify';
import { Note } from 'libs/apis/notes';

type Props = {
  packet: ParsedPacket;
  toast: ToastType;
  note?: Note;
  body: string;
  clickNote: (packet: ParsedPacket, note?: Note) => void;
}
function TimeTravelActionRow (props: Props) {
  const { packet, toast, note, clickNote, body } = props;

  const copyUrl = async () => {
    const url = packet.origin + packet.requestHeaders[0].split(' ')[1];
    (window as any).copyToClipboard(url);
    notify(toast, { statusCode: 200, data: 'Copied url to clipboard', error: '' });
  };

  const copyRaw = async () => {
    let raw = packet.requestHeaders.reduce((prev, current) => prev + current + '\r\n', '');
    raw += '\r\n' + body;
    (window as any).copyToClipboard(raw);
    notify(toast, { statusCode: 200, data: 'Copied raw request to clipboard', error: '' });
  };

  return (
    <Grid gridTemplateColumns="1fr 1fr">
      <Grid
        p="10px"
        border="1px solid LightGray"
        gridTemplateColumns="1fr 1fr"
      >
        <Box>
          <Button
            size="sm"
            mx="3px"
            colorScheme="yellow"
          >
            🕵️ {packet.codeName}
          </Button>
          <Button
            size="sm"
            mx="3px"
            colorScheme="green"
          >
            Reflected parameters: {Object.keys(packet.reflectedParameters).length}
          </Button>
          <Button
            size="sm"
            colorScheme={!note ? 'green' : 'orange'}
            onClick={() => clickNote(packet, note)}
          >
            📑 {!note ? 'Add note' : `View ${note.codeName}'s note`}
          </Button>
        </Box>
        <Box justifySelf="end">
          <Button
            mx="3px"
            size="sm"
            onClick={copyUrl}
            colorScheme="teal"
          >
            Copy URL
          </Button>
          <Button
            onClick={copyRaw}
            colorScheme="teal"
            mx="3px"
            size="sm"
          >
            Copy raw
          </Button>
        </Box>
      </Grid>
      <Box p="10px" border="1px solid LightGray">
        <Link
          href={`${GenericApi.backendUrl}/files/${storage.getProject()}/${packet.responseBodyHash}`}
          rel="nofollow noopener"
          target="_blank"
        >
          <Button
            colorScheme="facebook"
            size="sm"
          >
            🧾 Download
          </Button>
        </Link>
      </Box>
    </Grid>
  );
}

export default TimeTravelActionRow;
