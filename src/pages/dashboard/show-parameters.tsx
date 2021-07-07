import React from 'react';
import { Box, Button } from '@chakra-ui/react';

type Props = {
  parameters: string[];
  reflectedParameters: string[];
}

type paramReflect = {
  value: string;
  reflected: boolean;
}

function ShowParameters (props: Props) {
  const { parameters, reflectedParameters } = props;
  const [paramReflected, setParamReflected] = React.useState<paramReflect[]>([]);
  React.useEffect(() => {
    parameters.sort();
    reflectedParameters.sort();

    const result: paramReflect[] = [];
    let i = 0;
    let j = 0;
    while (i < parameters.length) {
      if (j === reflectedParameters.length) {
        result.push({
          value: parameters[i],
          reflected: false,
        });
        i += 1;
        continue;
      }
      if (parameters[i] === reflectedParameters[j]) {
        result.push({
          value: parameters[i],
          reflected: true,
        });
        i += 1;
        j += 1;
      } else if (parameters[i] < reflectedParameters[j]) {
        result.push({
          value: parameters[i],
          reflected: false,
        });
        i += 1;
      } else {
        j += 1;
      }
    }
    function checkLarger (a: string, b: string) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    }
    result.sort((a, b): number => {
      if (a.reflected && b.reflected) return checkLarger(a.value, b.value);
      if (a.reflected) return -1;
      if (b.reflected) return 1;
      return checkLarger(a.value, b.value);
    });
    setParamReflected(result);
  }, [parameters, reflectedParameters]);

  return (
    <Box
      bg="background.primary-white"
      p="10px"
      pl="30px"
      height="50vh"
      overflowY="scroll"
      borderRadius="5px"
      mt="3vh"
      boxShadow="sm"
    >
      {paramReflected.map(parameter =>
        <Button
          key={`parameter-${parameter.value}`}
          size="sm"
          borderRadius="5px"
          m="2px"
          colorScheme={parameter.reflected ? 'green' : 'blackAlpha'}
        >
          {parameter.value}
        </Button>
      )}
    </Box>
  );
}

export default ShowParameters;
