import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Select } from '@chakra-ui/select';
import storage from 'libs/storage';
import { User } from 'libs/apis/users';

type Props = {
  users: User[],
};
function SelectUser (props: Props) {
  const { users } = props;
  const currentCodename = storage.getCodeName();
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
