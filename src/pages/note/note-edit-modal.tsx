import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Textarea,
  ModalFooter,
  useToast,
  Button,
} from '@chakra-ui/react';
import { User } from 'libs/apis/users';

import SelectUser from 'pages/common/select-user';
import { ModalNote, NotesApi } from 'libs/apis/notes';
import storage from 'libs/storage';
import { notify } from 'libs/notify';

const noteApiInstance = NotesApi.getInstance();

type Props = {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  note: ModalNote;
  loadNotes: () => Promise<void>;
  setNote: React.Dispatch<React.SetStateAction<ModalNote>>;
};
function NoteEditModal (props: Props) {
  const {
    users,
    isOpen, onClose,
    note, setNote,
    loadNotes,
  } = props;

  const toast = useToast();

  const submitNote = async () => {
    let codeName = storage.getCodeName();
    if (!codeName) {
      codeName = users[0]?.codeName || 'Default codeName';
      storage.set('codeName', codeName);
    }
    const resp = await noteApiInstance.editNote(note.id || '', {
      ...note,
      codeName,
    });
    notify(toast, resp);
    loadNotes();
    onClose();
  };

  return (
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
          {`Edit ${note.codeName}'s note`}
          <br/>
          <Text
            fontWeight={100}
            opacity={0.4}
            fontSize="small"
          >
            In packet: {note.path}
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
            value={note.tags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNote({ ...note, tags: e.currentTarget.value });
            }}
          />
          <Text>Description:</Text>
          <Textarea
            whiteSpace='pre-wrap'
            value={note.description}
            rows={10}
            placeholder="something is weird here"
            mb="10px"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setNote({ ...note, description: e.currentTarget.value });
            }}
          />
          <Text>Editing note as</Text>
          <SelectUser users={users} />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="orange"
            mr={2}
            onClick={submitNote}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NoteEditModal;
