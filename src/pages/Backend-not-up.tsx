import React from 'react';
import { Box, Text, Image } from '@chakra-ui/react';
import Navbar from './common/navbar';
import Footer from './common/footer';

function BackendNotUp () {
  return (
    <Box bg="background.primary-grey">
      <Navbar />
      <Image
        src="/server-not-up.png"
        position="absolute"
        opacity="0.04"
        left="33%"
        top="20%"
      />
      <Text
        mt="30vh"
        as="h1"
        fontSize="8xl"
        textAlign="center"
      >
        Ooops!!!
      </Text>
      <Text
        mb="35vh"
        as="h2"
        fontSize="2xl"
        textAlign="center"
      >
        Backend at {process.env.REACT_APP_BACKEND_URL} is down
      </Text>
      <Footer />
    </Box>
  );
}

export default BackendNotUp;
