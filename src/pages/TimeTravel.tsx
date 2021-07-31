import React from 'react';
import Navbar from 'pages/common/navbar';
import { Box } from '@chakra-ui/react';
import { Packet, PacketsApi } from 'libs/apis/packets';
import TimeTravelTab from 'pages/timeTravel/time-travel-tab';

export const DEFAULT_TIME_TRAVEL_PACKETS_RANGE = 5;
const packetApiInstance = PacketsApi.getInstance();

function TimeTravelPage () {
  const [isLoading, setIsLoading] = React.useState(true);
  const [timeTravelPackets, setTimeTravelPackets] = React.useState<Packet[]>([]);

  const getTimeTravelPackets = async () => {
    const searchParams = new URL(window.location.href).searchParams;
    const range = searchParams.get('range') ?? DEFAULT_TIME_TRAVEL_PACKETS_RANGE;
    const requestPacketId = searchParams.get('requestPacketId') ?? '';
    const resp = await packetApiInstance.getTimeTravelPacketsById(requestPacketId, +range);
    setTimeTravelPackets(resp.data);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getTimeTravelPackets();
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      const searchParams = new URL(window.location.href).searchParams;
      const requestPacketId = searchParams.get('requestPacketId') ?? '';
      const arr = requestPacketId.split('.');
      const index = arr[1] ?? '';
      window.location.hash = index;
    }
  }, [isLoading]);

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <Box
        px="2%"
        mt="5vh"
      >
        {timeTravelPackets.map(packet =>
          <TimeTravelTab
            key={`timetraveltab-${packet.requestPacketId}`}
            packet={packet}
          />
        )}
      </Box>
    </Box>
  );
}

export default TimeTravelPage;
