import React from 'react';
import Navbar from 'pages/common/navbar';
import {
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { Packet, PacketsApi, ParsedPacket } from 'libs/apis/packets';
import TimeTravelTab from 'pages/timeTravel/time-travel-tab';
import { defaultNote, Note, NotesApi } from 'libs/apis/notes';
import { User, UsersApi } from 'libs/apis/users';
import SelectUser from './common/select-user';
import { notify } from 'libs/notify';
import storage from 'libs/storage';

export const DEFAULT_TIME_TRAVEL_PACKETS_RANGE = 5;
const packetApiInstance = PacketsApi.getInstance();
const userApiInstance = UsersApi.getInstance();
const noteApiInstance = NotesApi.getInstance();

type ModalNote = Note & {
  path: string;
};

function TimeTravelPage () {
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddingNote, setIsAddingNote] = React.useState(true);

  const [users, setUsers] = React.useState<User[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [modalNote, setModalNote] = React.useState<ModalNote>({ ...defaultNote, path: '' });

  const [timeTravelPackets, setTimeTravelPackets] = React.useState<ParsedPacket[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTimeTravelPackets = async () => {
    const searchParams = new URL(window.location.href).searchParams;
    const range = searchParams.get('range') ?? DEFAULT_TIME_TRAVEL_PACKETS_RANGE;
    const requestPacketId = searchParams.get('requestPacketId') ?? '';
    const { data } = await packetApiInstance.getTimeTravelPacketsById(requestPacketId, +range);
    const { notes, packets } = data;
    setTimeTravelPackets(packets);
    setNotes(notes);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getTimeTravelPackets();
    const getUsers = async () => {
      const { data: curUsers } = await userApiInstance.getUsersInCurrentProject();
      setUsers(curUsers);
    };
    getUsers();
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

  const onClickNote = (packet: Packet, note?: Note) => {
    if (!note) {
      setModalNote({
        ...defaultNote,
        path: `${packet.requestPacketIndex}: ${packet.path}`,
        requestPacketId: packet.requestPacketId,
      });
      setIsAddingNote(true);
    } else {
      setModalNote({
        ...note,
        path: `${packet.requestPacketIndex}: ${packet.path}`,
      });
      setIsAddingNote(false);
    }
    onOpen();
  };

  const submitNote = async () => {
    let codeName = storage.getCodeName();
    if (!codeName) {
      codeName = users[0]?.codeName || 'Default codeName';
      storage.set('codeName', codeName);
    }
    if (!modalNote.id) {
      const resp = await noteApiInstance.createNote({
        ...modalNote,
        codeName,
      });
      notify(toast, resp);
    }
    onClose();
  };

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
        {timeTravelPackets.map((packet, index) =>
          <TimeTravelTab
            toast={toast}
            key={`timetraveltab-${packet.requestPacketId}`}
            packet={packet}
            note={notes[index]}
            clickNote={onClickNote}
          />
        )}
      </Box>

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
          <ModalHeader>
            {isAddingNote ? 'Adding new note' : `Edit ${modalNote.codeName}'s note`}
            <br/>
            <Text
              fontWeight={100}
              opacity={0.4}
              fontSize="small"
            >
              In packet index {modalNote.path}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Tags:</Text>
            <Input
              fontStyle="bold"
              width="50%"
              my="5px"
              placeholder="bug xss idor info"
              value={modalNote.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setModalNote({ ...modalNote, tags: e.currentTarget.value });
              }}
            />
            <Text>Description:</Text>
            <Textarea
              whiteSpace='pre-wrap'
              value={modalNote.description}
              rows={10}
              placeholder="something is weird here"
              mb="10px"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setModalNote({ ...modalNote, description: e.currentTarget.value });
              }}
            />
            <Text>{isAddingNote ? 'Adding note as' : 'Editing note as'}</Text>
            <SelectUser users={users} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={isAddingNote ? 'green' : 'orange'}
              mr={2}
              onClick={submitNote}
            >
              {isAddingNote ? 'Add' : 'Edit'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TimeTravelPage;
