import React from 'react';
import { Box, Text, Th, Tr, Table, Thead, Tbody, SkeletonText, Grid, Link } from '@chakra-ui/react';
import { Packet, PacketsApi } from 'libs/apis/packets';
import OriginTabRow from './origin-tab-row';
import Pagination from 'pages/common/pagination';
import storage from 'libs/storage';

const packetApiInstance = PacketsApi.getInstance();

type Props = {
  origin: string;
  isFocus: boolean;
}
function OriginTab (props: Props) {
  const { origin, isFocus } = props;

  const packetsPerPage = storage.getNumPacketsOfOriginByProject(origin);

  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [numPackets, setNumPackets] = React.useState(0);
  const [numPages, setNumPages] = React.useState(1);
  const [packets, setPackets] = React.useState<Packet[]>([]);
  const [viewPackets, setViewPackets] = React.useState<Packet[]>([]);

  const getPacketsByOrigin = async (skip = 0, limit = 99999999) => { // TODO: If page too lag, switch to DEFAULT_PACKETS_PER_PAGE
    const resp = await packetApiInstance.getPacketsByOrigin(origin, skip, limit);
    setPackets(resp.data);
    setViewPackets(resp.data.slice(0, packetsPerPage));
    setLoading(false);
  };
  const getNumberPacketsByOrigin = async () => {
    const resp = await packetApiInstance.getNumberPacketsByOrigin(origin);
    const n = resp.data;
    setNumPackets(n);
    setNumPages(Math.ceil(n / packetsPerPage));
  };
  React.useEffect(() => {
    getNumberPacketsByOrigin();
    getPacketsByOrigin();
  }, [origin]);

  const onClickPagination = (p: number) => {
    setPage(p);
    setViewPackets(packets.slice((p - 1) * packetsPerPage, p * packetsPerPage));
  };

  return (
    <>
      <Grid
        gridTemplateColumns="1fr 1fr"
        bg={isFocus ? 'background.focus-orange' : 'background.primary-black'}
        borderRadius="5px 0px"
        id={origin}
        p="10px"
        color={isFocus ? 'background.focus-white' : 'white'}
      >
        <Link
          justifySelf="start"
          href={'/#' + origin}
        >
          {origin}
        </Link>
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
          ? <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
          : <Table
              size="sm"
              fontSize="xs"
            >
              <Thead>
                <Tr>
                  <Th>Index</Th>
                  <Th>Action</Th>
                  <Th>Path</Th>
                  <Th>Mime</Th>
                  <Th>Parameters</Th>
                </Tr>
              </Thead>
              <Tbody>
                {viewPackets.map((packet, index) =>
                  <OriginTabRow
                    key={`${packet.origin}/${packet.path}`}
                    index={1 + index + (page - 1) * packetsPerPage}
                    packet={packet}
                  />
                )}
              </Tbody>
            </Table>
        }
        <Box
          mt="10px"
          textAlign="right"
        >
          <Pagination
            hrefHash={origin}
            id={origin}
            page={page}
            setPage={onClickPagination}
            maxPage={numPages}
          />
        </Box>
      </Box>
    </>
  );
}

export default OriginTab;
