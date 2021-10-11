import React from 'react';
import { ParsedPath, PathStatus } from 'libs/apis/parsed_paths';
import { Link, Button, Tooltip, Tr, Td, Text } from '@chakra-ui/react';
import { DEFAULT_TIME_TRAVEL_PACKETS_RANGE } from 'pages/TimeTravel';

type ColoredProps = {
  children: string,
  isNew: boolean,
}
function ColoredParsedPath (props: ColoredProps) {
  const { children, isNew } = props;
  return (
    <Text
      color={isNew ? 'green' : 'grey'}
      fontWeight="bold"
    >
      {children}
    </Text>
  );
}

type StatusPathProps = {
  status: PathStatus,
}
function StatusPath (props: StatusPathProps) {
  const { status } = props;
  if (status === PathStatus.TODO) {
    return (
      <Text opacity={0.5}>Will be scanned</Text>
    );
  }
  if (status === PathStatus.SCANNING) {
    return (
      <Text color="red">Scanning</Text>
    );
  }
  if (status === PathStatus.DONE) {
    return (
      <Text color="green">Done</Text>
    );
  }
  return <Text></Text>;
}

type Props = {
  parsedPath: ParsedPath;
};
function SiteMapTabRow (props: Props) {
  const { parsedPath } = props;
  return (
    <Tr>
      <Td pl="10px">
        <Tooltip fontSize="xs" label="Time machine" openDelay={200}>
          <Link href={`/timeTravel?range=${DEFAULT_TIME_TRAVEL_PACKETS_RANGE}&requestPacketId=${parsedPath.requestPacketId}`}>
            <Button size="sm" bg="transparent">
              🕙
            </Button>
          </Link>
        </Tooltip>
      </Td>
      <Td width="100px">
        <StatusPath status={parsedPath.status} />
      </Td>
      <Td pl="10px">
        <ColoredParsedPath isNew={parsedPath.requestPacketId === ''}>{parsedPath.path}</ColoredParsedPath>
      </Td>
    </Tr>
  );
}

export default SiteMapTabRow;
