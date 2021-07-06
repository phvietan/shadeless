import React from 'react';
import { Box, Grid, Heading, useToast } from '@chakra-ui/react';
import { deleteCookie, getCookie, setCookie } from 'libs/cookie';
import { notify } from 'libs/notify';
import DoneRow from './done-row';
import TodoRow from './todo-row';
import HackingRow from './hacking-row';
import { Project, ProjectsApi, ProjectStatus } from 'libs/apis/projects';

const projectApiInstance = ProjectsApi.getInstance();

type Props = {
  projects: Project[]
  getProjects: () => Promise<void>
}
function ShowProjectsBox (props: Props) {
  const { projects, getProjects } = props;
  const toast = useToast();
  const currentProject = getCookie('project');

  const [todoProjects, setTodoProjects] = React.useState<Project[]>([]);
  const [hackingProjects, setHackingProjects] = React.useState<Project[]>([]);
  const [doneProjects, setDoneProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    const todo = projects.filter(p => p.status === ProjectStatus.TODO);
    const hacking = projects.filter(p => p.status === ProjectStatus.HACKING);
    const done = projects.filter(p => p.status === ProjectStatus.DONE);
    setTodoProjects(todo);
    setHackingProjects(hacking);
    setDoneProjects(done);
  }, [projects]);

  const setHacking = async (projectName: string) => {
    setCookie('project', projectName, 99999);
    const response = await projectApiInstance.edit({ status: ProjectStatus.HACKING }, projectName);
    notify(toast, response);
    await getProjects();
  };
  const setDone = async (projectName: string) => {
    if (currentProject === projectName) deleteCookie('project');
    const response = await projectApiInstance.edit({ status: ProjectStatus.DONE }, projectName);
    notify(toast, response);
    await getProjects();
  };
  const deleteProject = async (name: string) => {
    const response = await projectApiInstance.delete(name);
    notify(toast, response);
    window.location.reload();
  };
  return (
    <Box
      mt="5vh"
      mx="10%"
      borderRadius="5px"
      px="3%" py="2%"
      bg="white"
      shadow="xs"
    >
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}
        gap="5px"
      >
        <Box>
          <Heading as="h3" textAlign="center">
            Todo 📝
          </Heading>
          {todoProjects.map(project =>
            <TodoRow
              project={project}
              setHacking={setHacking}
              deleteButton={deleteProject}
              key={`todo-${project.name}`}
            />
          )}
        </Box>
        <Box>
          <Heading as="h3" textAlign="center">
            Hacking 🕵️
          </Heading>
          {hackingProjects.map(project =>
            <HackingRow
              project={project}
              setDone={setDone}
              setHacking={setHacking}
              deleteButton={deleteProject}
              key={`hacking-${project.name}`}
            />
          )}
        </Box>
        <Box>
          <Heading as="h3" textAlign="center">
            Done 💾
          </Heading>
          {doneProjects.map(project =>
            <DoneRow
              project={project}
              setHacking={setHacking}
              deleteButton={deleteProject}
              key={`done-${project.name}`}
            />
          )}
        </Box>
      </Grid>

    </Box>
  );
}

export default ShowProjectsBox;
