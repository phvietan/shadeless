import React from 'react';
import { Note } from 'libs/apis/notes';
import { dateToString } from 'libs/timing';
import { Td, Tr } from '@chakra-ui/table';
import { Button } from '@chakra-ui/button';
import { Packet } from 'libs/apis/packets';
import { DEFAULT_TIME_TRAVEL_PACKETS_RANGE } from 'pages/TimeTravel';
import { Link } from '@chakra-ui/layout';

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
          size="xs"
          mx="3px"
          my="3px"
        >
          {tag}
        </Button>
      )}
    </>
  );
}

type Props = {
  note: Note;
  packet: Packet;
  onClickEditBtn: (note: Note, packet: Packet) => void;
  onClickDeleteBtn: (note: Note, packet: Packet) => void;
};
function NoteRow (props: Props) {
  const { note, packet, onClickEditBtn, onClickDeleteBtn } = props;

  return (
    <Tr>
      <Td>
        <Tags id={note.id || ''} tags={note.tags} />
      </Td>
      <Td textAlign="center">{note.codeName}</Td>
      <Td
        textAlign="center"
        fontSize="xs"
      >
        <Link
          color="blue"
          href={`/timeTravel?range=${DEFAULT_TIME_TRAVEL_PACKETS_RANGE}&requestPacketId=${packet.requestPacketId}`}
        >
          {packet.origin + packet.requestHeaders[0].split(' ')[1]}
        </Link>
      </Td>
      <Td
        whiteSpace='pre-wrap'
        py="10px"
      >
        {note.description}
      </Td>
      <Td>{dateToString(note.updated_at || new Date(), false)}</Td>
      <Td>
        <Button
          size="sm"
          colorScheme="orange"
          mx="10px"
          onClick={() => onClickEditBtn(note, packet)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => onClickDeleteBtn(note, packet)}
        >
          Delete
        </Button>
      </Td>
    </Tr>
  );
}

export default NoteRow;
