import React from 'react';
import { Tr, Td, Button, Tooltip, Text, Image, Link } from '@chakra-ui/react';
import { ParsedPacket } from 'libs/apis/packets';
import { DEFAULT_TIME_TRAVEL_PACKETS_RANGE } from 'pages/TimeTravel';

type MimeTypeProps = {
  packet: ParsedPacket;
};
function MimeImage (props: MimeTypeProps) {
  const { packet } = props;

  const parseTypeToFileName = (packet: ParsedPacket): string => {
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

type MethodWithColorProps = {
  children: string,
};
function MethodWithColor (props: MethodWithColorProps) {
  const { children } = props;
  let color = 'grey';
  if (children === 'GET') color = 'green';
  else if (children === 'POST') color = 'purple';
  else if (children === 'PUT' || children === 'PATCH') color = 'orange';
  else if (children === 'DELETE') color = 'red';
  return (
    <Text
      textAlign="center"
      color={color}
      fontWeight={800}
    >
      {children}
    </Text>
  );
}

type Props = {
  packet: ParsedPacket;
};

function OriginTabRow (props: Props) {
  const { packet } = props;
  return (
    <Tr>
      <Td width="0px">
        <Tooltip fontSize="xs" label="Time machine" openDelay={200}>
          <Link href={`/timeTravel?range=${DEFAULT_TIME_TRAVEL_PACKETS_RANGE}&requestPacketId=${packet.requestPacketId}`}>
            <Button size="sm" bg="transparent">
              🕙
            </Button>
          </Link>
        </Tooltip>
      </Td>
      <Td>
        <MethodWithColor>
          {packet.method}
        </MethodWithColor>
      </Td>
      <Td width="40%"><Text wordBreak="break-all">{packet.path}</Text></Td>
      <Td>
        {packet.responseStatus}
      </Td>
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
