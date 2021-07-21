import React from 'react';
import { Box, Button, SkeletonText, Text } from '@chakra-ui/react';
import { paramReflect, parseParameterAndReflected } from 'libs/helper';

type Props = {
  isLoading: boolean;
  parameters: string[];
  reflectedParameters: string[];
}

function ShowParameters (props: Props) {
  const { parameters, reflectedParameters, isLoading } = props;
  const [paramReflected, setParamReflected] = React.useState<paramReflect[]>([]);
  React.useEffect(() => {
    const result = parseParameterAndReflected(parameters, reflectedParameters);
    setParamReflected(result);
  }, [parameters, reflectedParameters]);

  return (
    <Box>
      <Text as="h1"
        bg="background.primary-black"
        color="white"
        p="10px"
        borderRadius="5px 0px"
      >
        Parameters (green ones are reflected)
      </Text>
      <Box
        bg="background.primary-white"
        p="10px"
        pl="30px"
        height="50vh"
        overflowY="scroll"
        borderRadius="5px"
        boxShadow="sm"
      >
        {isLoading &&
          <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
        }
        {paramReflected.map(parameter =>
          <Button
            key={`parameter-${parameter.value}`}
            size="xs"
            borderRadius="5px"
            m="2px"
            colorScheme={parameter.reflected ? 'green' : 'blackAlpha'}
          >
            {parameter.value}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ShowParameters;
