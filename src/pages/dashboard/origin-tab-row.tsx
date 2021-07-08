import React from 'react';
import { Tr, Td, Button } from '@chakra-ui/react';
import { Packet } from 'libs/apis/packets';
import { paramReflect, parseParameterAndReflected } from 'libs/helper';

type Props = {
  packet: Packet;
};

function OriginTabRow (props: Props) {
  const { packet } = props;
  const [paramReflected, setParamReflected] = React.useState<paramReflect[]>([]);
  React.useEffect(() => {
    const result = parseParameterAndReflected(
      packet.parameters,
      packet.reflectedParameters,
    );
    setParamReflected(result);
  }, [packet]);

  return (
    <Tr>
      <Td>
        <Button size="sm" bg="transparent">
          🕙
        </Button>
      </Td>
      <Td>{packet.path}</Td>
      <Td>{packet.responseMimeType}</Td>
      <Td>
        {paramReflected.map((param, index) =>
          <Button
            key={`${packet.origin}/${packet.path}/${param.value}/${index}`}
            size="sm"
            borderRadius="5px"
            m="2px"
            colorScheme={param.reflected ? 'green' : 'blackAlpha'}
          >
            {param.value}
          </Button>
        )}
      </Td>
    </Tr>
  );
}

export default OriginTabRow;
