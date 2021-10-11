import React from 'react';
import { SiteMapMetadata } from './sitemap-object';
import { SkeletonText, Box, Text, Button, Grid } from '@chakra-ui/react';
import { PieChart } from 'react-minimal-pie-chart';

type DescProps = {
  children: string;
  color: string;
}
function DescriptionPieChart (props: DescProps) {
  const { children, color } = props;
  return (
    <Box ml="200px" mt="10px">
      <Button
        display="inline"
        color={color}
        bg={color}
        borderRadius="0"
        _hover={{}}
        _active={{}}
        size="xs"
      >
        aaaaa
      </Button>
      <Text ml="10px" display="inline">{children}</Text>
      <br/>
    </Box>
  );
}

type Props = {
  isLoading: boolean;
  metadata: SiteMapMetadata;
};
function SiteMapHeaderStatistic (props: Props) {
  const { metadata, isLoading } = props;
  return (
    <Box
      bg="background.primary-white"
      boxShadow="sm"
      borderRadius="5px"
      height={metadata.origins.length !== 0 ? '55vh' : ''}
    >
      <Text as="h1"
        bg="background.primary-black"
        color="white"
        p="10px"
        pl="30px"
        borderRadius="5px 0px"
      >
        Statistics 📌
      </Text>
      {isLoading && <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />}
      <Box
        p="10px"
        pl="30px"
      >
        <Grid gridTemplateColumns="1fr 1fr">
          <Box ml="100px">
            <Text>Number of origins: {metadata.origins.length}</Text>
            <Text>Number of paths: {metadata.numPaths}</Text>
            <Text>🤖 Bot scanned: {metadata.numScanned}</Text>
            <Text>🤖 Bot found: {metadata.numFound}</Text>
          </Box>
          <Box alignSelf="end">
            <DescriptionPieChart color="#C13C37">
              Paths to scan
            </DescriptionPieChart>
            <DescriptionPieChart color="green">
              Scanned path
            </DescriptionPieChart>
          </Box>
        </Grid>

        <Box
          w="33%"
          ml="33%"
        >
          <PieChart
            lineWidth={40}
            data={[
              { title: `Paths to scan: ${metadata.numPaths - metadata.numScanned}`, value: metadata.origins.length - metadata.numScanned, color: '#C13C37' },
              { title: `Scanned paths: ${metadata.numScanned}`, value: metadata.numScanned, color: 'green' },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default SiteMapHeaderStatistic;
