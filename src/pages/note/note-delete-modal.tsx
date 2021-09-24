import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  ModalFooter,
  useToast,
  Button,
} from '@chakra-ui/react';
import { ModalNote, NotesApi } from 'libs/apis/notes';
import { notify } from 'libs/notify';

const noteApiInstance = NotesApi.getInstance();

type Props = {
  isOpen: boolean;
  onClose: () => void;
  note: ModalNote;
  loadNotes: () => Promise<void>;
};
function NoteDeleteModal (props: Props) {
  const { isOpen, onClose, note, loadNotes } = props;
  const toast = useToast();

  const deleteNote = async () => {
    const resp = await noteApiInstance.deleteNote(note.id || '');
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
          {`Deleting ${note.codeName}'s note`}
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
          Are you sure you want to delete this note?
          <Textarea
            whiteSpace='pre-wrap'
            value={note.description}
            rows={10}
            isDisabled
            placeholder="something is weird here"
            mb="10px"
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr={2}
            onClick={deleteNote}
          >
            Yes, I am sure, delete it!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NoteDeleteModal;
