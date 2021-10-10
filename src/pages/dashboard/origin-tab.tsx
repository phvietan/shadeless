import React from 'react';
import { Box, Th, Tr, Table, Thead, Tbody, SkeletonText } from '@chakra-ui/react';
import { PacketsApi, ParsedPacket } from 'libs/apis/packets';
import OriginTabRow from './origin-tab-row';
import Pagination from 'pages/common/pagination';
import storage from 'libs/storage';
import { usePacketsPerPage } from 'libs/hooks/packets_per_page.hook';
import OriginTabHeader from './origin-tab-header';
import TableSortButton from 'pages/common/table-sort-button';

const packetApiInstance = PacketsApi.getInstance();

const compareReflected = (a: ParsedPacket, b: ParsedPacket): number => {
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

  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [numPages, setNumPages] = React.useState(1);
  const [packets, setPackets] = React.useState<ParsedPacket[]>([]);
  const [viewPackets, setViewPackets] = React.useState<ParsedPacket[]>([]);
  const [packetsPerPage, setPacketsPerPage] = usePacketsPerPage(storage.getProject(), origin);

  const getPacketsByOrigin = async (skip = 0, limit = 99999999) => { // TODO: If page too lag, switch to DEFAULT_PACKETS_PER_PAGE
    const { data } = await packetApiInstance.getPacketsByOrigin(origin, skip, limit);
    data.sort((a, b) => compareReflected(a, b));
    setPackets(data);
    setNumPages(Math.ceil(data.length / packetsPerPage));
    setViewPackets(data.slice(0, packetsPerPage));
    setLoading(false);
  };
  React.useEffect(() => {
    getPacketsByOrigin();
  }, [origin]);
  React.useEffect(() => {
    setNumPages(Math.ceil(packets.length / packetsPerPage));
    setPage(1);
    setViewPackets(packets.slice(0, packetsPerPage));
  }, [packetsPerPage, loading]);

  const onClickPagination = (p: number) => {
    setPage(p);
    setViewPackets(packets.slice((p - 1) * packetsPerPage, p * packetsPerPage));
  };

  const onClickSort = (key: string) => {
    const isSorted = (arr: ParsedPacket[], key: string): boolean => {
      for (let i = 0; i < arr.length - 1; i += 1) {
        const cur: any = arr[i];
        const nxt: any = arr[i + 1];
        if (cur[key] > nxt[key]) return false;
      }
      return true;
    };
    const isReverse = isSorted(packets, key) ? -1 : 1;
    const sortedPackets = packets.slice();
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
    const isSorted = (arr: ParsedPacket[]): boolean => {
      for (let i = 0; i < arr.length - 1; i += 1) {
        if (compareReflected(arr[i], arr[i + 1]) === 1) return false;
      }
      return true;
    };
    const isReverse = isSorted(packets) ? -1 : 1;
    const sortedPackets = packets.slice();
    sortedPackets.sort((a, b) => compareReflected(a, b) * isReverse);
    setPage(1);
    setPackets(sortedPackets);
    setViewPackets(sortedPackets.slice(0, packetsPerPage));
  };

  return (
    <>
      <OriginTabHeader
        origin={origin}
        isFocus={isFocus}
        numEndpoints={packets.length}
        packetsPerPage={packetsPerPage}
        setPacketsPerPage={setPacketsPerPage}
      />
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
                  <Th><TableSortButton onClick={() => onClickSort('method')}>Method</TableSortButton></Th>
                  <Th><TableSortButton onClick={() => onClickSort('path')}>Path</TableSortButton></Th>
                  <Th><TableSortButton onClick={() => onClickSort('responseStatus')}>Status</TableSortButton></Th>
                  <Th textAlign="center">
                    <TableSortButton onClick={() => onClickSort('responseMimeType')}>
                      Mime
                    </TableSortButton>
                  </Th>
                  <Th><TableSortButton onClick={onClickSortParam}>Parameters</TableSortButton></Th>
                </Tr>
              </Thead>
              <Tbody>
                {viewPackets.map(packet =>
                  <OriginTabRow
                    key={`${packet.origin}/${packet.hash}`}
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
