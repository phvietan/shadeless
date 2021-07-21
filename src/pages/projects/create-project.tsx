import React from 'react';
import { Heading, Button, Input, Box, useToast } from '@chakra-ui/react';
import { ProjectsApi } from 'libs/apis/projects';
import { notify } from 'libs/notify';

const projectApiInstance = ProjectsApi.getInstance();

type Props = {
  getProjects: () => Promise<void>
}
function CreateProjectBox (props: Props) {
  const { getProjects } = props;

  const toast = useToast();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const createProject = async function () {
    const resp = await projectApiInstance.create({ name, description });
    notify(toast, resp);
    getProjects();
  };

  return (
    <Box
      mt="10vh"
      mx="10%"
      px="2%" py="2%"
      shadow="xs"
      bg="white"
      borderRadius="5px"
    >
      <Heading
        as="h2"
        size="xl"
        mb={3}
      >
        Create new project
      </Heading>
      <Input
        border="1px solid black"
        bg="white"
        mb={3}
        placeholder="Project name: i.e viettel"
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        border="1px solid black"
        bg="white"
        mb={3}
        placeholder="Project description (your target): i.e viettel.vn, apk.com.vietteltelecom, lifebox.vn"
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button
        colorScheme="green"
        onClick={() => createProject()}
      >
        Create
      </Button>
    </Box>
  );
}

export default CreateProjectBox;
