import React from 'react';
import { Box, Text, Link, SkeletonText, Grid, Input } from '@chakra-ui/react';

type Props = {
  origins: string[];
  isLoading: boolean;
}

function ShowOrigins (props: Props) {
  const { origins, isLoading } = props;
  const [search, setSearch] = React.useState('');
  const [viewOrigins, setViewOrigins] = React.useState(origins);

  React.useEffect(() => {
    const view = origins.filter(o => o.includes(search));
    setViewOrigins(view);
  }, [origins, search]);

  return (
    <Box>
      <Grid
        gridTemplateColumns="1fr 1fr"
        bg="background.primary-black"
        color="white"
        borderRadius="5px 0px"
      >
        <Text
          as="h1"
          p="10px"
          pl="30px"
        >
          Origins
        </Text>
        <Input
          alignSelf="center"
          justifySelf="end"
          mr="20px"
          bg="white"
          size="sm"
          color="black"
          width="245px"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Filter http://...                                 🔎"
        />
      </Grid>
      <Box
        bg="background.primary-white"
        p="10px"
        pl="30px"
        height={origins.length !== 0 ? '50vh' : ''}
        overflowY="scroll"
        borderRadius="5px"
        boxShadow="sm"
      >
        {isLoading && <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />}
        {viewOrigins.map(origin =>
          <Text
            as="p"
            key={`origin-${origin}`}
          >
            <Link href={'#' + origin}>{origin}</Link>
          </Text>
        )}
        {origins.length === 0 && !isLoading &&
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
