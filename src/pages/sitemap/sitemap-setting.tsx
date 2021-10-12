import React from 'react';
import { Text, Stack } from '@chakra-ui/react';
import { BotPath, BotPathApi, defaultBotPath } from 'libs/apis/bot_path';

const botPathInstance = BotPathApi.getInstance();

function SiteMapSetting () {
  const [botPath, setBotPath] = React.useState<BotPath>(defaultBotPath);

  React.useEffect(() => {
    const getBotPathSetting = async () => {
      const resp = await botPathInstance.getBotPath();
      setBotPath(resp.data);
    };
    getBotPathSetting();
  }, []);

  return (
    <Stack>
      <Text>Bot path is {botPath.running ? 'running' : 'not running'}</Text>
      <Text>Number of async request: {botPath.asyncRequest}</Text>
      <Text>Sleep between requests: {botPath.sleepRequest} (ms)</Text>
    </Stack>
  );
}

export default SiteMapSetting;
