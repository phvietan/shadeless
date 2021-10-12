import React from 'react';
import { Box, SkeletonText, Table, Thead, Tr, Th, Tbody, useDisclosure } from '@chakra-ui/react';
import Navbar from './common/navbar';
import { defaultNote, Note, NotesApi, ModalNote } from 'libs/apis/notes';
import NoteRow from './note/note-row';
import { Packet } from 'libs/apis/packets';
import NoteEditModal from './note/note-edit-modal';
import NoteDeleteModal from './note/note-delete-modal';
import TableSortButton from './common/table-sort-button';

const noteApiInstance = NotesApi.getInstance();

function NotesPage (): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [packets, setPackets] = React.useState<Packet[]>([]);
  const [modalNote, setModalNote] = React.useState<ModalNote>({ ...defaultNote, path: '' });

  const loadAllNotes = async () => {
    const { data } = await noteApiInstance.getNotesInCurrentProject();
    const { notes, packets } = data;
    setNotes(notes);
    setPackets(packets);
    setIsLoading(false);
  };

  React.useEffect(() => {
    loadAllNotes();
  }, []);

  const onClickEditBtn = (note: Note, packet: Packet) => {
    onOpenEdit();
    setModalNote({
      ...note,
      path: packet.origin + packet.requestHeaders[0].split(' ')[1],
    });
  };

  const onClickDeleteBtn = (note: Note, packet: Packet) => {
    onOpenDelete();
    setModalNote({
      ...note,
      path: packet.origin + packet.requestHeaders[0].split(' ')[1],
    });
  };

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <Box
        mt="5vh"
        mx="4%"
        bg="background.primary-white"
      >
        <Box
          bg="orange"
          color="black"
          p="10px"
          px="30px"
          borderRadius="5px 0px"
          fontSize="xl"
          fontWeight="bold"
        >
          📑 Notes
        </Box>
        {isLoading
          ? <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
          : <Table
              size="sm"
              fontSize="xs"
              variant="striped"
              colorScheme="orange"
            >
              <Thead>
                <Tr>
                  <Th width="10%">
                    <TableSortButton
                      kkey="tags"
                      array={notes}
                      setArray={setNotes}
                    >
                      Tags
                    </TableSortButton>
                  </Th>
                  <Th width="20px" textAlign="center">
                    <TableSortButton
                      kkey="codeName"
                      array={notes}
                      setArray={setNotes}
                    >
                      Tags
                    </TableSortButton>
                  </Th>
                  <Th textAlign="center" width="15%">At</Th>
                  <Th width="40%">Description</Th>
                  <Th width="20px" textAlign="center">
                    <TableSortButton
                      kkey="updated_at"
                      array={notes}
                      setArray={setNotes}
                    >
                      Updated at
                    </TableSortButton>
                  </Th>
                  <Th textAlign="center">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notes.map((note, idx) =>
                  <NoteRow
                    key={`note-${note.id}-${idx}`}
                    note={note}
                    packet={packets[idx]}
                    onClickEditBtn={onClickEditBtn}
                    onClickDeleteBtn={onClickDeleteBtn}
                  />
                )}
              </Tbody>
            </Table>
        }
      </Box>

      <NoteEditModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        note={modalNote}
        loadNotes={loadAllNotes}
        setNote={setModalNote}
      />

      <NoteDeleteModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        note={modalNote}
        loadNotes={loadAllNotes}
      />
    </Box>
  );
}

export default NotesPage;
