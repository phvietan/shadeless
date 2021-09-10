import React from 'react';
import { Tr, Td, Button, Tooltip, Text } from '@chakra-ui/react';
import { Packet } from 'libs/apis/packets';
import { useLocation } from 'wouter';
import { DEFAULT_TIME_TRAVEL_PACKETS_RANGE } from 'pages/TimeTravel';

type Props = {
  packet: Packet;
};

const shortenPath = (path: string): string => {
  // const linebreak = 110;
  // const arr = [];
  // for (let i = 0; i < path.length; i += linebreak) {
  //   arr.push(path.substr(i, linebreak));
  // }
  // return arr.join('\n');
  return path;
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
      <Td width="40%"><Text wordBreak="break-all">{shortenPath(packet.path)}</Text></Td>
      <Td textAlign="center">{packet.responseMimeType}</Td>
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
