import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Select } from '@chakra-ui/select';
import storage from 'libs/storage';
import { User, UsersApi } from 'libs/apis/users';

const userApiInstance = UsersApi.getInstance();

function SelectUser () {
  const [users, setUsers] = React.useState<User[]>([]);
  const [currentCodename, setCurrentCodename] = React.useState(storage.getCodeName() || 'Default codename');

  React.useEffect(() => {
    const getAllUsers = async function () {
      const resp = await userApiInstance.getUsersInCurrentProject();
      setUsers(resp.data);
    };
    getAllUsers();
  }, []);

  React.useEffect(() => {
    setCurrentCodename(users[0]?.codeName);
  }, [users]);

  const onChangeUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    storage.set('codeName', e.target.value);
  };
  return (
    <Select
      icon={<ChevronDownIcon />}
      width="120px"
      onChange={onChangeUser}
      defaultValue={currentCodename}
    >
      {users.map(u =>
        <option
          key={`user-${u.codeName}`}
          value={u.codeName}
        >
          {u.codeName}
        </option>
      )}
    </Select>
  );
}

export default SelectUser;
