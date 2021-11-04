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
  Box,
  SkeletonText,
} from '@chakra-ui/react';
import { notify } from 'libs/notify';
import { BotFuzzer, BotFuzzerApi, defaultBotFuzzer } from 'libs/apis/bot_fuzzer';

const botFuzzerInstance = BotFuzzerApi.getInstance();

function FuzzSetting () {
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [botFuzzer, setBotFuzzer] = React.useState<BotFuzzer>(defaultBotFuzzer);
  const [botFuzzerUpdate, setBotFuzzerUpdate] = React.useState<BotFuzzer>(defaultBotFuzzer);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getBotFuzzerSetting = async () => {
    const resp = await botFuzzerInstance.getBotFuzzer();
    setBotFuzzer(resp.data);
    setBotFuzzerUpdate(resp.data);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getBotFuzzerSetting();
  }, []);

  const switchBotFuzzerRunning = async () => {
    const resp = await botFuzzerInstance.switchBotFuzzer();
    notify(toast, resp);
    setBotFuzzer({ ...botFuzzer, running: Boolean(1 - +botFuzzer.running) });
  };

  const updateBotFuzzer = async () => {
    const resp = await botFuzzerInstance.updateBotFuzzer(botFuzzerUpdate);
    notify(toast, resp);
    await getBotFuzzerSetting();
    onClose();
  };

  return (
    <Box
      bg="background.primary-white"
      boxShadow="sm"
      borderRadius="5px"
      m="2%"
    >
      <Text as="h1"
        bg="DarkRed"
        color="white"
        p="10px"
        pl="30px"
        borderRadius="5px 0px"
      >
        Setting / statistics for fuzzing 📌
      </Text>
      {isLoading && <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />}
      <Box p="10px" pl="30px">
        <Stack>
          <Text as="span">Bot fuzzer is {botFuzzer.running ? 'running' : 'not running'}</Text>
          <Button
            onClick={switchBotFuzzerRunning}
            width="100px"
            colorScheme={botFuzzer.running ? 'red' : 'green'}
          >
            {botFuzzer.running ? 'Stop' : 'Start'}
          </Button>
          <Text>Number of async request: {botFuzzer.asyncRequest}</Text>
          <Text>Sleep between requests: {botFuzzer.sleepRequest} (ms)</Text>
          <Text>Timeout per request: {botFuzzer.timeout} (ms)</Text>
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
              <ModalHeader>Updating bot fuzzer</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb="5px">Number of async request</Text>
                <Input
                  type="text"
                  value={botFuzzerUpdate.asyncRequest}
                  onChange={(e) => setBotFuzzerUpdate({ ...botFuzzerUpdate, asyncRequest: +e.target.value })}
                />
                <Text mb="5px">Sleep time between requests (in ms)</Text>
                <Input
                  type="text"
                  value={botFuzzerUpdate.sleepRequest}
                  onChange={(e) => setBotFuzzerUpdate({ ...botFuzzerUpdate, sleepRequest: +e.target.value })}
                />
                <Text mb="5px">Timeout per request (in ms)</Text>
                <Input
                  type="text"
                  value={botFuzzerUpdate.timeout}
                  onChange={(e) => setBotFuzzerUpdate({ ...botFuzzerUpdate, timeout: +e.target.value })}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme='green'
                  mr={2}
                  onClick={updateBotFuzzer}
                >
                  Edit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      </Box>
    </Box>
  );
}

export default FuzzSetting;
