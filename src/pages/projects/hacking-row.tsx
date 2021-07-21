import React from 'react';
import { Box, Heading, Button, HStack, Text, Grid, Divider } from '@chakra-ui/react';
import { dateToString } from 'libs/timing';
import { Project } from 'libs/apis/projects';
import storage from 'libs/storage';

type Props = {
  project: Project;
  setDone: (project: Project) => void;
  setHacking: (project: Project) => void;
  deleteButton: (project: Project) => void;
}
function HackingRow (props: Props) {
  const currentProject = storage.getProject();
  const { project, setHacking, setDone, deleteButton } = props;

  return (
    <Box
      width="100%"
      p="3%"
      mt="5px"
      border={(currentProject === project.name) ? '1px solid red' : '1px solid black'}
    >
      <Grid
        gridTemplateColumns="1fr 1fr"
      >
        <Heading
          as="h4"
          fontSize="2xl"
          w="100%"
          justifySelf="start"
        >
          {project.name}
        </Heading>

        <Text
          as="i"
          fontSize="xs"
          justifySelf="end"
        >
          Created at: {dateToString(project.createdAt)}
        </Text>

        <Heading
          as="h5"
          lineHeight="1.4em"
          fontWeight="100"
          ml="10px"
          fontSize="xs"
          w="100%"
          justifySelf="start"
        >
          {project.description}
        </Heading>

      </Grid>

      <Divider my="8px" />
      <HStack>
        <Button
          size="xs"
          colorScheme="purple"
          onClick={() => setHacking(project)}
        >
          Set hacking
        </Button>
        <Button
          size="xs"
          colorScheme="green"
          onClick={() => setDone(project)}
        >
          Set done
        </Button>
        <Button
          size="xs"
          colorScheme="orange"
          onClick={() => alert('Is implementing')}
        >
         Edit
        </Button>
        <Button
          size="xs"
          colorScheme="red"
          onClick={() => deleteButton(project)}
        >
         Delete
        </Button>
      </HStack>

    </Box>
  );
}

export default HackingRow;
