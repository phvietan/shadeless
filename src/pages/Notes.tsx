import React from 'react';
import { Box, SkeletonText, Table, Thead, Tr, Th, Button, Tbody } from '@chakra-ui/react';
import Navbar from './common/navbar';
import { Note, NotesApi } from 'libs/apis/notes';
import NoteRow from './note/note-row';

const noteApiInstance = NotesApi.getInstance();

type TableSortButtonProps = {
  children: any;
  onClick: (...args: any[]) => any;
}
function TableSortButton (props: TableSortButtonProps) {
  const { children, onClick } = props;
  return (
    <Button
      onClick={onClick}
      bg="transparent"
    >
      ↑↓ {children}
    </Button>
  );
}

function NotesPage (): JSX.Element {
  const [isLoading, setIsLoading] = React.useState(true);
  const [notes, setNotes] = React.useState<Note[]>([]);

  React.useEffect(() => {
    const loadAllNotes = async () => {
      const { data } = await noteApiInstance.getNotesInCurrentProject();
      setNotes(data);
      setIsLoading(false);
    };
    loadAllNotes();
  }, []);

  const onClickSort = async (key: string) => {
    const isSorted = (arr: Note[], key: string): boolean => {
      for (let i = 0; i < arr.length - 1; i += 1) {
        const cur: any = arr[i];
        const nxt: any = arr[i + 1];
        if (cur[key] > nxt[key]) return false;
      }
      return true;
    };
    const isReverse = isSorted(notes, key) ? -1 : 1;
    const sortedNotes = notes;
    sortedNotes.sort((a: any, b: any) => {
      if (a[key] > b[key]) return 1 * isReverse;
      if (a[key] < b[key]) return -1 * isReverse;
      return 0;
    });
    setNotes(sortedNotes);
  };

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <Box
        mt="5vh"
        mx="8%"
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
          Notes
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
                  <Th width="10%"><TableSortButton onClick={() => onClickSort('tags')}>Tags</TableSortButton></Th>
                  <Th textAlign="center">
                    <TableSortButton onClick={() => onClickSort('codeName')}>
                      Code name
                    </TableSortButton>
                  </Th>
                  <Th>At</Th>
                  <Th width="50%">Description</Th>
                  <Th><TableSortButton onClick={() => onClickSort('updated_at')}>Updated at</TableSortButton></Th>
                  <Th textAlign="center">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notes.map(note =>
                  <NoteRow
                    key={`note-${note.id}`}
                    note={note}
                  />
                )}
              </Tbody>
            </Table>
        }
      </Box>
    </Box>
  );
}

export default NotesPage;
