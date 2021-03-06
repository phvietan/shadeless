/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Heading, Button, HStack, Text, Grid, Divider, Link } from '@chakra-ui/react';
import { dateToString } from 'libs/timing';
import { Project } from 'libs/apis/projects';
import storage from 'libs/storage';
import ProjectDescription from './project-description';

type Props = {
  project: Project;
  setHacking: (project: Project) => void;
  deleteButton: (project: Project) => void;
}

function DoneRow (props: Props) {
  const currentProject = storage.getProject();
  const { project, deleteButton, setHacking } = props;
  return (
    <Box
      width="100%"
      p="2%"
      mt="5px"
      border={(currentProject === project.name) ? '1px solid red' : '1px solid black'}
    >
      <ProjectDescription project={project}/>
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
          colorScheme="orange"
        >
         <Link href={'/projects/' + project.name}>Edit</Link>
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

export default DoneRow;
