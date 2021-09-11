import React from 'react';
import { Box, Text, Th, Tr, Table, Thead, Tbody, SkeletonText, Grid, Link, Button } from '@chakra-ui/react';
import { Packet, PacketsApi } from 'libs/apis/packets';
import OriginTabRow from './origin-tab-row';
import Pagination from 'pages/common/pagination';
import storage from 'libs/storage';
import { usePacketsPerPage } from 'libs/hooks/packets_per_page.hook';

const packetApiInstance = PacketsApi.getInstance();

type TableSortButtonProps = {
  children: any;
  onClick: (...args: any[]) => any;
}
function TableSortButton (props: TableSortButtonProps) {
  const { children, onClick } = props;
  return (
    <Button
      onClick={onClick}
      bg="transparent"
    >
      ↑↓ {children}
    </Button>
  );
}

const compareReflected = (a: Packet, b: Packet): number => {
  const refA = Object.keys(a.reflectedParameters).length;
  const refB = Object.keys(b.reflectedParameters).length;
  if (refA < refB) return 1;
  if (refA > refB) return -1;

  const paramA = Object.keys(a.parameters).length;
  const paramB = Object.keys(b.parameters).length;
  if (paramA < paramB) return 1;
  if (paramA > paramB) return -1;
  return 0;
};

type Props = {
  origin: string;
  isFocus: boolean;
}
function OriginTab (props: Props) {
  const { origin, isFocus } = props;

  const [packetsPerPage, setPacketsPerPage] = usePacketsPerPage(storage.getProject(), origin);

  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [numPackets, setNumPackets] = React.useState(0);
  const [numPages, setNumPages] = React.useState(1);
  const [packets, setPackets] = React.useState<Packet[]>([]);
  const [viewPackets, setViewPackets] = React.useState<Packet[]>([]);

  const getPacketsByOrigin = async (skip = 0, limit = 99999999) => { // TODO: If page too lag, switch to DEFAULT_PACKETS_PER_PAGE
    const { data } = await packetApiInstance.getPacketsByOrigin(origin, skip, limit);
    data.sort((a, b) => compareReflected(a, b));
    setPackets(data);
    setViewPackets(data.slice(0, packetsPerPage));
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
  React.useEffect(() => {
    setNumPages(Math.ceil(numPackets / packetsPerPage));
    setPage(1);
    setViewPackets(packets.slice(0, packetsPerPage));
  }, [packetsPerPage, loading]);

  const onClickPagination = (p: number) => {
    setPage(p);
    setViewPackets(packets.slice((p - 1) * packetsPerPage, p * packetsPerPage));
  };

  const onClickSort = (key: string) => {
    const isSorted = (arr: Packet[], key: string): boolean => {
      for (let i = 0; i < arr.length - 1; i += 1) {
        const cur: any = arr[i];
        const nxt: any = arr[i + 1];
        if (cur[key] > nxt[key]) return false;
      }
      return true;
    };
    const isReverse = isSorted(packets, key) ? -1 : 1;
    const sortedPackets = packets;
    sortedPackets.sort((a: any, b: any) => {
      if (a[key] > b[key]) return 1 * isReverse;
      if (a[key] < b[key]) return -1 * isReverse;
      return 0;
    });
    setPage(1);
    setPackets(sortedPackets);
    setViewPackets(sortedPackets.slice(0, packetsPerPage));
  };
  const onClickSortParam = () => {
    const isSorted = (arr: Packet[]): boolean => {
      for (let i = 0; i < arr.length - 1; i += 1) {
        if (compareReflected(arr[i], arr[i + 1]) === 1) return false;
      }
      return true;
    };
    const isReverse = isSorted(packets) ? -1 : 1;
    const sortedPackets = packets;
    sortedPackets.sort((a, b) => compareReflected(a, b) * isReverse);
    setPage(1);
    setPackets(sortedPackets);
    setViewPackets(sortedPackets.slice(0, packetsPerPage));
  };

  const changeNumPacketsPerPage = async (chooseObj : React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = chooseObj.target;
    setPacketsPerPage(parseInt(value));
    await storage.setNumPacketsOfOriginByProject(origin, parseInt(value));
  };

  return (
    <>
      <Grid
        gridTemplateColumns="1fr 1fr"
        bg={isFocus ? 'background.focus-orange' : 'background.primary-black'}
        borderRadius="5px 0px"
        id={origin}
        p="10px"
        px="2%"
        color={isFocus ? 'background.focus-white' : 'white'}
      >
        <Box display="inline">
          <Link
            display="inline"
            justifySelf="start"
            href={'/#' + origin}
          >
            {origin}
          </Link>
          <select
            style={{
              color: 'black',
              marginLeft: '10px',
              fontSize: '14px',
            }}
            defaultValue={packetsPerPage}
            onChange={changeNumPacketsPerPage}
          >
            <option value="15">15</option>
            <option value="40">40</option>
            <option value="70">70</option>
            <option value="100">100</option>
          </select>
        </Box>

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
              variant="striped"
              colorScheme="blackAlpha"
            >
              <Thead>
                <Tr>
                  <Th>Action</Th>
                  <Th><TableSortButton onClick={() => onClickSort('path')}>Path</TableSortButton></Th>
                  <Th textAlign="center"><TableSortButton onClick={() => onClickSort('responseMimeType')}>Mime</TableSortButton></Th>
                  <Th><TableSortButton onClick={onClickSortParam}>Parameters</TableSortButton></Th>
                </Tr>
              </Thead>
              <Tbody>
                {viewPackets.map((packet, index) =>
                  <OriginTabRow
                    key={`${packet.origin}/${packet.path}`}
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
