import React from 'react';
import { Box, Button, SkeletonText, Text } from '@chakra-ui/react';

type Props = {
  isLoading: boolean;
  parameters: string[];
  reflectedParameters: Record<string, string>;
}

function ShowParameters (props: Props) {
  const { parameters, reflectedParameters, isLoading } = props;
  const [showParams, setShowParams] = React.useState<string[]>([]);
  React.useEffect(() => {
    const params = parameters;
    params.sort((a, b) => {
      const checkA = a in reflectedParameters;
      const checkB = b in reflectedParameters;
      if (checkA !== checkB) return checkA === true ? -1 : 1;
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
    setShowParams(params);
  }, [isLoading]);
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
        height={parameters.length !== 0 ? '50vh' : ''}
        overflowY="scroll"
        borderRadius="5px"
        boxShadow="sm"
      >
        {isLoading &&
          <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
        }
        {showParams.map(param =>
          <Button
            key={`parameter-${param}`}
            size="xs"
            borderRadius="5px"
            m="2px"
            colorScheme={param in reflectedParameters ? 'green' : 'blackAlpha'}
          >
            {param}
          </Button>
        )}
        {parameters.length === 0 && !isLoading &&
          <Text
            textAlign="center"
            fontStyle="italic"
            my="10px"
          >
            No parameter found in database
          </Text>
        }
      </Box>
    </Box>
  );
}

export default ShowParameters;
