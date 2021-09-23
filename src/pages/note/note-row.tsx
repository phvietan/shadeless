import React from 'react';
import { Note } from 'libs/apis/notes';
import { dateToString } from 'libs/timing';
import { Td, Tr } from '@chakra-ui/table';
import { Button } from '@chakra-ui/button';

type TagProps = {
  id: string;
  tags: string;
};
function Tags (props: TagProps) {
  const { tags, id } = props;

  const splitAndUnique = (s: string): string[] => {
    const splitted = s.split(' ');
    const set = new Set(splitted);
    return Array.from(set);
  };

  const fromTagToColor = (tag: string): string => {
    if (['rce', 'xss', 'idor', 'bug', 'sql', 'sqli', 'nosql', 'nosqli', 'file', 'upload', 'ssrf', 'command'].includes(tag)) {
      return 'red';
    }
    if (tag === 'info') return 'blue';
    if (['wtf', 'what', 'clgt', 'nani', '?', 'check'].includes(tag)) {
      return 'purple';
    }
    return 'teal';
  };

  const [arrTags, setArrTags] = React.useState<string[]>(splitAndUnique(tags));
  React.useEffect(() => {
    setArrTags(splitAndUnique(tags));
  }, [tags]);

  return (
    <>
      {arrTags.map((tag, index) =>
        <Button
          key={`tag-${id}-${tag}-${index}`}
          colorScheme={fromTagToColor(tag)}
          size="sm"
        >
          {tag}
        </Button>
      )}
    </>
  );
}

type Props = {
  note: Note;
};
function NoteRow (props: Props) {
  const { note } = props;
  return (
    <Tr
      height="100px"
    >
      <Td>
        <Tags id={note.id || ''} tags={note.tags} />
      </Td>
      <Td textAlign="center">{note.codeName}</Td>
      <Td textAlign="center">
        {note.requestPacketId}
      </Td>
      <Td whiteSpace='pre-wrap'>{note.description}</Td>
      <Td>{dateToString(note.updated_at || new Date(), false)}</Td>
      <Td>
        <Button size="sm" colorScheme="orange" mx="10px">
          Edit
        </Button>
        <Button size="sm" colorScheme="red">
          Delete
        </Button>
      </Td>
    </Tr>
  );
}

export default NoteRow;
