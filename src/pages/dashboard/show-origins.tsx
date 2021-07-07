import React from 'react';
import { Box } from '@chakra-ui/react';

type Props = {
  origins: string[];
}

function ShowOrigins (props: Props) {
  const { origins } = props;
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
      {origins.map(origin =>
        <p key={`origin-${origin}`}>
          {origin}
        </p>
      )}
    </Box>
  );
}

export default ShowOrigins;
