import React from 'react';
import { Tr, Td, Button, Tooltip, Text, Image } from '@chakra-ui/react';
import { Packet } from 'libs/apis/packets';
import { useLocation } from 'wouter';
import { DEFAULT_TIME_TRAVEL_PACKETS_RANGE } from 'pages/TimeTravel';

type MimeTypeProps = {
  packet: Packet;
};
function MimeImage (props: MimeTypeProps) {
  const { packet } = props;

  const parseTypeToFileName = (packet: Packet): string => {
    if (packet.path.slice(-5) === '.woff') {
      return 'font.png';
    }
    const type = packet.responseMimeType;
    const lowercase = type.toLocaleLowerCase();
    if (lowercase === 'jpeg' || lowercase === 'png' || lowercase === 'image') return 'image.png';
    if (['css', 'html', 'json', 'text', 'gif', 'script', 'svg'].includes(lowercase)) return lowercase + '.png';
    return 'dat.png';
  };

  const filename = parseTypeToFileName(packet);
  return (
    <Image
      src={`/mime/${filename}`}
      w="32px"
      h="32px"
      ml="43%"
    />
  );
}

type Props = {
  packet: Packet;
};

function OriginTabRow (props: Props) {
  const { packet } = props;
  const setLocation = useLocation()[1];

  const timeMachine = async () => {
    setLocation(`/timeTravel?range=${DEFAULT_TIME_TRAVEL_PACKETS_RANGE}&requestPacketId=${packet.requestPacketId}`);
  };

  return (
    <Tr>
      <Td width="0px">
        <Tooltip fontSize="xs" label="Time machine" openDelay={200}>
          <Button
            size="sm"
            bg="transparent"
            onClick={timeMachine}
          >
            🕙
          </Button>
        </Tooltip>
      </Td>
      <Td width="40%"><Text wordBreak="break-all">{packet.path}</Text></Td>
      <Td textAlign="center">
        <MimeImage packet={packet} />
      </Td>
      <Td width="40%">
        {packet.parameters.map((param, index) =>
          <Button
            key={`${packet.origin}/${packet.path}/${param}/${index}`}
            size="xs"
            borderRadius="5px"
            m="2px"
            colorScheme={(param in packet.reflectedParameters) ? 'green' : 'blackAlpha'}
          >
            {param}
          </Button>
        )}
      </Td>
    </Tr>
  );
}

export default OriginTabRow;
