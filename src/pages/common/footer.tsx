import React from 'react';
import { Box } from '@chakra-ui/react';

function Footer () {
  return (
    <Box as="footer"
      textAlign="center"
      bg="black"
      color="white"
      p="10px"
      boxShadow="md"
    >
      @ 2021 Shadeless reconnaissance application
    </Box>
  );
}

export default Footer;
