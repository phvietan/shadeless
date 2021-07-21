import React from 'react';
import { Tr, Td, Button } from '@chakra-ui/react';
import { Packet } from 'libs/apis/packets';
import { paramReflect, parseParameterAndReflected } from 'libs/helper';

type Props = {
  packet: Packet;
  index: number;
};

function OriginTabRow (props: Props) {
  const { packet, index } = props;
  const [paramReflected, setParamReflected] = React.useState<paramReflect[]>([]);
  React.useEffect(() => {
    const result = parseParameterAndReflected(
      packet.parameters,
      packet.reflectedParameters,
    );
    setParamReflected(result);
  }, [packet]);

  const timeMachine = async () => {
    console.log(packet);
  };

  return (
    <Tr>
      <Td textAlign="center" width="0px">
        {index}
      </Td>
      <Td width="0px">
        <Button size="sm" bg="transparent" onClick={timeMachine}>
          🕙
        </Button>
      </Td>
      <Td width="40%">{packet.path}</Td>
      <Td>{packet.responseMimeType}</Td>
      <Td width="40%">
        {paramReflected.map((param, index) =>
          <Button
            key={`${packet.origin}/${packet.path}/${param.value}/${index}`}
            size="xs"
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
