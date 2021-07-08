import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

type Props = {
  origins: string[];
}

function ShowOrigins (props: Props) {
  const { origins } = props;
  return (
    <Box>
      <Text as="h1"
        bg="background.primary-black"
        color="white"
        p="10px"
        borderRadius="5px 0px"
      >
        Origins
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
        {origins.map(origin =>
          <Text
            as="p"
            key={`origin-${origin}`}
          >
            <Link href={'#' + origin}>{origin}</Link>
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default ShowOrigins;
