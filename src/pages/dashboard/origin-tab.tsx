import React from 'react';
import { Box, Text, Th, Tr, Table, Thead, Tbody, SkeletonText, Grid } from '@chakra-ui/react';
import { Packet, PacketsApi } from 'libs/apis/packets';
import OriginTabRow from './origin-tab-row';
import Pagination from 'pages/pagination';

type Props = {
  origin: string;
}

const PACKETS_PER_PAGE = 2;

const packetApiInstance = PacketsApi.getInstance();

function OriginTab (props: Props) {
  const { origin } = props;

  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [numPackets, setNumPackets] = React.useState(0);
  const [numPages, setNumPages] = React.useState(1);
  const [packets, setPackets] = React.useState<Packet[]>([]);

  const getPacketsByOrigin = async (skip = 0, limit = PACKETS_PER_PAGE) => {
    const resp = await packetApiInstance.getPacketsByOrigin(origin, skip, limit);
    setPackets(resp.data);
    setLoading(false);
  };
  const getNumberPacketsByOrigin = async () => {
    const resp = await packetApiInstance.getNumberPacketsByOrigin(origin);
    const n = resp.data;
    setNumPackets(n);
    setNumPages(Math.ceil(n / PACKETS_PER_PAGE));
  };
  React.useEffect(() => {
    getNumberPacketsByOrigin();
    getPacketsByOrigin();
  }, []);

  return (
    <Box>
      <Grid
        gridTemplateColumns="1fr 1fr"
        bg="background.primary-black"
        borderRadius="5px 0px"
        id={origin}
        p="10px"
        color="white"
      >
        <Text as="h1"
          justifySelf="start"
        >
          {origin}
        </Text>
        <Text as="h1"
          justifySelf="end"
        >
          {numPackets} endpoints
        </Text>
      </Grid>

      <Box
        bg="background.primary-white"
        p="10px"
        pl="30px"
        overflowY="scroll"
        borderRadius="5px"
        boxShadow="sm"
        mb="5vh"
      >
        {loading
          ? <SkeletonText />
          : <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Action</Th>
                <Th>Path</Th>
                <Th>Mime</Th>
                <Th>Parameters</Th>
              </Tr>
            </Thead>
            <Tbody>
              {packets.map(packet =>
                <OriginTabRow
                  key={`${packet.origin}/${packet.path}`}
                  packet={packet}
                />
              )}
            </Tbody>
          </Table>
        }
        <Pagination
          id={origin}
          page={page}
          setPage={setPage}
          maxPage={numPages}
        />
      </Box>
    </Box>
  );
}

export default OriginTab;
