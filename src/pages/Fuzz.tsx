import React from 'react';
import Navbar from './common/navbar';
import FuzzTab from './fuzz/fuzz-tab';
import { notify } from 'libs/notify';
import { Box, Text, Grid, useToast } from '@chakra-ui/react';
import { PacketsApi, ParsedPacket } from 'libs/apis/packets';
import FuzzSetting from './fuzz/fuzz-setting';

const packetApiInstance = PacketsApi.getInstance();

type FuzzSectionProps = {
  msg: string;
  title: string;
  apis: ParsedPacket[];
  restoreApis: () => any;
}
function FuzzSection (props: FuzzSectionProps) {
  const { msg, title, apis, restoreApis } = props;

  const toast = useToast();
  const updateScore = async (api: ParsedPacket, newScore: number) => {
    const resp = await packetApiInstance.putStaticFuzzPackets(api.id || '', newScore);
    notify(toast, resp);
    restoreApis();
  };

  return (
    <Box
      bg="background.primary-white"
      p="10px"
      my="30px"
      mx="2%"
      boxShadow="md"
    >
      <Text as="h1" fontSize="4xl"> {title} </Text>
      <Grid
        gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
        gap="10px"
        border="1px solid LightGray"
      >
        {apis.map(api =>
          <FuzzTab
            api={api}
            key={`fuzz-tab-${api.id}`}
            updateScore={updateScore}
          />
        )}
      </Grid>
      {apis.length === 0 && <Text as="i">{msg}</Text>}
    </Box>
  );
}

function Fuzz () {
  const [fuzzedApis, setFuzzedApis] = React.useState<ParsedPacket[]>([]);
  const [todoApis, setTodoApis] = React.useState<ParsedPacket[]>([]);
  const [staticEndpoints, setStaticEndPoints] = React.useState<ParsedPacket[]>([]);
  // const [scanningPaths, setScanningPaths] = React.useState<ParsedPath[]>([]);

  const getApis = async () => {
    const { data } = await packetApiInstance.getFuzzPackets();
    setFuzzedApis(data.done);
    setTodoApis(data.todo);
    const { data: staticData } = await packetApiInstance.getStaticFuzzPackets();
    setStaticEndPoints(staticData);
    // setScanningPaths(a.scanning);
  };
  React.useEffect(() => {
    getApis();
  }, []);

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <FuzzSetting />

      <FuzzSection
        title="Fuzzed apis"
        msg="No fuzzed api yet, have you run the bot?"
        restoreApis={getApis}
        apis={fuzzedApis}
      />
      <FuzzSection
        title="To do apis"
        msg="No api in database to fuzz"
        restoreApis={getApis}
        apis={todoApis}
      />
      <FuzzSection
        title="Removed paths"
        msg="There is no static file endpoint yet"
        restoreApis={getApis}
        apis={staticEndpoints}
      />

    </Box>
  );
}

export default Fuzz;
