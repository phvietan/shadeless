import React from 'react';
import { Box, Button, Img, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import { BlacklistType, convertStringToBlacklistType, defaultProject, Project, ProjectsApi } from 'libs/apis/projects';
import Navbar from 'pages/common/navbar';
import BlacklistRow from './config-project/blacklist-row';
import SubmitButton from './common/submit-button';
import { useLocation } from 'wouter';
import { notify } from 'libs/notify';
import storage from 'libs/storage';

const projectApiInstance = ProjectsApi.getInstance();

type Props = {
  projectName: string
};

function ConfigProjectPage (props: Props) {
  const { projectName } = props;
  const [project, setProject] = React.useState<Project>(defaultProject);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const setLocation = useLocation()[1];
  const toast = useToast();

  const addBlacklist = () => {
    const newBlacklist = project.blacklist;
    newBlacklist.push({
      type: BlacklistType.BLACKLIST_VALUE,
      value: '',
    });
    setProject({ ...project, blacklist: newBlacklist });
  };

  const deleteRow = (index: number) => {
    const newBlacklist = project.blacklist;
    newBlacklist.splice(index, 1);
    setProject({ ...project, blacklist: newBlacklist });
  };

  const onChangeBlacklistValue = (index: number, value: string) => {
    const newBlacklist = project.blacklist;
    newBlacklist[index].value = value;
    setProject({
      ...project,
      blacklist: newBlacklist,
    });
  };

  const onChangeBlacklistType = (index: number, value: string) => {
    const newBlacklist = project.blacklist;
    newBlacklist[index].type = convertStringToBlacklistType(value);
    setProject({
      ...project,
      blacklist: newBlacklist,
    });
  };

  const editProject = async () => {
    setIsSubmitting(true);
    const resp = await projectApiInstance.edit(project, project.id);
    notify(toast, resp);
    setIsSubmitting(false);
    if (resp.statusCode === 200) {
      if (storage.getProject() === projectName) storage.set('project', project.name);
      if (project.name !== projectName) setLocation(`/projects/${project.name}`);
    }
  };

  React.useEffect(() => {
    (async function () {
      const resp = await projectApiInstance.getOne(projectName);
      if (resp.statusCode === 404) {
        setLocation('/projects');
      }
      setProject(resp.data);
    })();
  }, [projectName]);

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      <Navbar />
      <Box
        mt="5vh"
        mx="24%"
        borderRadius="5px"
        px="2%" py="2%"
        bg="white"
        shadow="xs"
      >
        <Text
          as="h2"
          fontSize="3xl"
          display="inline"
          justifySelf="center"
        >
          Title:
        </Text>
        <Button
          width="15"
          ml="10px"
          mb="15px"
          onClick={() => setIsDisabled(!isDisabled)}
        >
          <Img
            src="/edit.svg"
            width="20px"
          />
        </Button>
        <br/>
        <Input
          isDisabled={isDisabled}
          fontStyle="bold"
          width="50%"
          my="5px"
          value={project.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setProject({ ...project, name: e.currentTarget.value });
          }}
        />

        <Text
          mt="5px"
          as="h1"
          mb="10px"
          fontSize="2xl"
        >
          Description:
        </Text>
        <Textarea
          whiteSpace='pre-wrap'
          value={project.description}
          rows={5}
          isDisabled={isDisabled}
          mb="10px"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setProject({ ...project, description: e.currentTarget.value });
          }}
        />

        <Text
          as="h1"
          fontSize="2xl"
          mb="10px"
        >
          Blacklist:
          <Button
            ml="6px"
            size="sm"
            bg="transparent"
            isDisabled={isDisabled}
            onClick={addBlacklist}
          >
            <Img
              src="/plus.svg"
              width="20px"
            />
          </Button>
        </Text>
        {project.blacklist.length === 0 &&
          <Text as="i">
            No blacklist added
          </Text>
        }
        {project.blacklist.map((blacklist, index) =>
          <BlacklistRow
            onChangeBlacklistType={
              (e: React.ChangeEvent<HTMLInputElement>) => onChangeBlacklistType(index, e.currentTarget.value)
            }
            onChangeBlacklistValue={
              (e: React.ChangeEvent<HTMLInputElement>) => onChangeBlacklistValue(index, e.currentTarget.value)
            }
            deleteBlacklistRow={() => deleteRow(index)}
            isDisabled={isDisabled}
            blacklist={blacklist}
            key={`blacklist-${project.id}-${index}`}
            showTooltip={index === 0}
          />
        )}

        <br/>
        <SubmitButton
          colorScheme="green"
          isDisabled={isDisabled}
          ml="46%"
          mt="30px"
          onClick={editProject}
          isSubmitting={isSubmitting}
        >
          Save
        </SubmitButton>
      </Box>
    </Box>
  );
}

export default ConfigProjectPage;
