import React from 'react';
import { Box, Text, Image } from '@chakra-ui/react';
import Navbar from './navbar';
import { useLocation } from 'wouter';

function Page404 () {
  const [location] = useLocation();
  return (
    <Box
      bg="background.primary-grey"
      pb="4vh"
    >
      <Navbar />
      <Image
        src="/question.png"
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
        404 Not found!!!
      </Text>
      <Text
        mb="35vh"
        as="h2"
        fontSize="2xl"
        textAlign="center"
      >
        Path at {location} is not found
      </Text>
    </Box>
  );
}

export default Page404;
