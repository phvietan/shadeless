import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { defaultProject, Project, ProjectsApi } from 'libs/apis/projects';
import Navbar from 'pages/navbar';

const projectApiInstance = ProjectsApi.getInstance();

type Props = {
  projectName: string
};

function ViewCurrentProjectPage (props: Props) {
  const { projectName } = props;
  const [project, setProject] = React.useState<Project>(defaultProject);

  React.useEffect(() => {
    (async function () {
      const resp = await projectApiInstance.getOne(projectName);
      setProject(resp.data);
    })();
  }, [projectName]);

  return (
    <Box
      bg="background.primary-grey"
    >
      <Navbar />
      <Box
        mt="5vh"
        mx="10%"
        borderRadius="5px"
        px="2%" py="2%"
        bg="white"
        shadow="xs"
      >
        <Text
          as="h1"
          fontSize="3xl"
        >
          Project <Text as="span" fontSize="4xl" fontStyle="bold"> {project.name}</Text>
        </Text>
        <Text
          as="h2"
          fontSize="xl"
        >
          Description:
        </Text>
        <Text
          as="i"
          fontSize="md"
          whiteSpace='pre-wrap'
        >
          {project.description}
        </Text>
      </Box>
    </Box>
  );
}

export default ViewCurrentProjectPage;
