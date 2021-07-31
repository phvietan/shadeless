import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from 'pages/common/navbar';
import ShowProjectsBox from 'pages/projects/show-project';
import CreateProjectBox from 'pages/projects/create-project';
import { Project, ProjectsApi } from 'libs/apis/projects';

const projectApiInstance = ProjectsApi.getInstance();

function ProjectsPage () {
  const [projects, setProjects] = React.useState<Project[]>([]);

  const getProjects = async () => {
    const response = await projectApiInstance.getAll();
    setProjects(response.data);
  };
  React.useEffect(() => {
    getProjects();
  }, []);

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <CreateProjectBox
        getProjects={getProjects}
      />
      <ShowProjectsBox
        projects={projects}
        getProjects={getProjects}
      />
    </Box>
  );
}

export default ProjectsPage;
