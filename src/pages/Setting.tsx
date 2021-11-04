import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from 'pages/common/navbar';
import ShowProjectsBox from 'pages/setting/show-project';
import CreateProjectBox from 'pages/setting/create-project';
import { Project, ProjectsApi } from 'libs/apis/projects';
import { User, UsersApi } from 'libs/apis/users';

const projectApiInstance = ProjectsApi.getInstance();
const userApiInstance = UsersApi.getInstance();

function SettingPage () {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);

  const getProjects = async () => {
    const response = await projectApiInstance.getAll();
    setProjects(response.data);
  };
  React.useEffect(() => {
    getProjects();
    const getUsers = async () => {
      const { data } = await userApiInstance.getUsersInCurrentProject();
      setUsers(data);
    };
    getUsers();
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

export default SettingPage;
