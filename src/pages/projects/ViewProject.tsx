import { defaultProject, Project, ProjectsApi } from 'libs/apis/projects';
import Navbar from 'pages/navbar';
import React from 'react';

const projectApiInstance = ProjectsApi.getInstance();

type Props = {
  projectName: string
};

function ViewProjectPage (props: Props) {
  const { projectName } = props;
  const [project, setProject] = React.useState<Project>(defaultProject);

  React.useEffect(() => {
    (async function () {
      const resp = await projectApiInstance.getOne(projectName);
      setProject(resp.data);
    })();
  }, []);

  return (
    <>
      <Navbar />
      You are viewing {projectName}: {JSON.stringify(project)}
    </>
  );
}

export default ViewProjectPage;
