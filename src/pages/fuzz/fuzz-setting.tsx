import React from 'react';
import {
  Text,
  Stack,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  Input,
} from '@chakra-ui/react';
import { BotPath, BotPathApi, defaultBotPath } from 'libs/apis/bot_path';
import { notify } from 'libs/notify';

const botPathInstance = BotPathApi.getInstance();

function FuzzSetting () {
  const toast = useToast();
  const [botPath, setBotPath] = React.useState<BotPath>(defaultBotPath);
  const [botPathUpdate, setBotPathUpdate] = React.useState<BotPath>(defaultBotPath);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getBotPathSetting = async () => {
    const resp = await botPathInstance.getBotPath();
    setBotPath(resp.data);
    setBotPathUpdate(resp.data);
  };
  React.useEffect(() => {
    getBotPathSetting();
  }, []);

  const switchBotPathRunning = async () => {
    const resp = await botPathInstance.switchBotPath();
    notify(toast, resp);
    setBotPath({ ...botPath, running: Boolean(1 - +botPath.running) });
  };

  const updateBotPath = async () => {
    const resp = await botPathInstance.updateBotPath(botPathUpdate);
    notify(toast, resp);
    await getBotPathSetting();
    onClose();
  };

  return (
    <Stack>
      <Text as="span">Bot path is {botPath.running ? 'running' : 'not running'}</Text>
      <Button
        onClick={switchBotPathRunning}
        width="100px"
        colorScheme={botPath.running ? 'red' : 'green'}
      >
        {botPath.running ? 'Stop' : 'Start'}
      </Button>
      <Text>Number of async request: {botPath.asyncRequest}</Text>
      <Text>Sleep between requests: {botPath.sleepRequest} (ms)</Text>
      <Button
        colorScheme="orange"
        onClick={onOpen}
        width="80px"
      >
        Edit
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent
          colorScheme="red"
          p="10px"
        >
          <ModalHeader>Updating bot path</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="5px">Number of async request</Text>
            <Input
              type="text"
              value={botPathUpdate.asyncRequest}
              onChange={(e) => setBotPathUpdate({ ...botPathUpdate, asyncRequest: +e.target.value })}
            />
            <Text mb="5px">Sleep time between requests (in ms)</Text>
            <Input
              type="text"
              value={botPathUpdate.sleepRequest}
              onChange={(e) => setBotPathUpdate({ ...botPathUpdate, sleepRequest: +e.target.value })}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='green'
              mr={2}
              onClick={updateBotPath}
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default FuzzSetting;
