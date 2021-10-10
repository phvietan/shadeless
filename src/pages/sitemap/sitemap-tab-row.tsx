import React from 'react';
import { ParsedPath } from 'libs/apis/parsed_paths';
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

type Props = {
  parsedPath: ParsedPath;
};
function SiteMapTabRow (props: Props) {
  const { parsedPath } = props;
  return (
    <Tr>
      <Td width="0px">
        <Tooltip fontSize="xs" label="Time machine" openDelay={200}>
          <Link href={`/timeTravel?range=${DEFAULT_TIME_TRAVEL_PACKETS_RANGE}&requestPacketId=${parsedPath.requestPacketId}`}>
            <Button size="sm" bg="transparent">
              🕙
            </Button>
          </Link>
        </Tooltip>
      </Td>
      <Td>
        <ColoredParsedPath isNew={parsedPath.requestPacketId === ''}>{parsedPath.path}</ColoredParsedPath>
      </Td>
    </Tr>
  );
}

export default SiteMapTabRow;
