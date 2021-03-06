import React from 'react';
import { Box, Button, HStack, Link } from '@chakra-ui/react';
import { Project } from 'libs/apis/projects';
import storage from 'libs/storage';
import ProjectDescription from './project-description';

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
          colorScheme="green"
          onClick={() => setDone(project)}
        >
          Set done
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

export default HackingRow;
