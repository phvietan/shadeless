import React from 'react';
import { Flex, Input, Select, Tooltip, Text, Img, Button, Box } from '@chakra-ui/react';
import { Blacklist, BlacklistType } from 'libs/apis/projects';
import { ChevronDownIcon } from '@chakra-ui/icons';

type Props = {
  key: string;
  deleteBlacklistRow: () => void;
  onChangeBlacklistType: (e: any) => void;
  onChangeBlacklistValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  blacklist: Blacklist;
  showTooltip: boolean;
};
function BlacklistRow (props: Props) {
  const {
    isDisabled,
    blacklist,
    deleteBlacklistRow,
    onChangeBlacklistValue,
    onChangeBlacklistType,
    showTooltip,
  } = props;

  return (
    <Flex flexDirection="row" alignItems="center">
      <Button
        ml="6px"
        size="sm"
        bg="transparent"
        isDisabled={isDisabled}
        onClick={deleteBlacklistRow}
      >
        <Img
          src="/remove.svg"
          width="20px"
        />
      </Button>
      <Input
        isDisabled={isDisabled}
        fontStyle="bold"
        width="50%"
        my="5px"
        onChange={onChangeBlacklistValue}
        value={blacklist.value}
        placeholder={blacklist.type === BlacklistType.BLACKLIST_VALUE ? 'https://googleads.g.doubleclick.net' : '.*google.*'}
        mr="5px"
      />
      <Select
        icon={<ChevronDownIcon />}
        width="120px"
        onChange={onChangeBlacklistType}
        defaultValue={blacklist.type}
        isDisabled={isDisabled}
      >
        <option value={BlacklistType.BLACKLIST_VALUE}>as Value</option>
        <option value={BlacklistType.BLACKLIST_REGEX}>as Regex</option>
      </Select>
      {showTooltip &&
        <Tooltip placement="top" label={
          <Box p="5px">
            <Text>- Blacklist as value will blacklist exact origin</Text>
            <Text>- Blacklist as regex will remove all origin that match your regex (can only specify at most 1 regex)</Text>
          </Box>
        }>
          <Img
            src="/question.svg"
            width="20px"
            m="10px"
          />
        </Tooltip>
      }
    </Flex>
  );
}

export default BlacklistRow;
