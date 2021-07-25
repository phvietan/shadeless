import React from 'react';
import { Box, Text, Link, SkeletonText } from '@chakra-ui/react';

type Props = {
  origins: string[];
  isLoading: boolean;
}

function ShowOrigins (props: Props) {
  const { origins, isLoading } = props;
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
        height={origins.length !== 0 ? '50vh' : ''}
        overflowY="scroll"
        borderRadius="5px"
        boxShadow="sm"
      >
        {isLoading &&
          <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
        }
        {origins.map(origin =>
          <Text
            as="p"
            key={`origin-${origin}`}
          >
            <Link href={'#' + origin}>{origin}</Link>
          </Text>
        )}
        {origins.length === 0 &&
          <Text
            textAlign="center"
            fontStyle="italic"
            my="10px"
          >
            No origin found in database
          </Text>
        }
      </Box>
    </Box>
  );
}

export default ShowOrigins;
