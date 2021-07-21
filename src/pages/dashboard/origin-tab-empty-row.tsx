import React from 'react';
import { Tr, Td, Button } from '@chakra-ui/react';

function OriginTabEmptyRow () {
  return (
    <Tr>
      <Td textAlign="center" width="0px">
      </Td>
      <Td width="0px">
        <Button size="sm" bg="transparent">
        </Button>
      </Td>
      <Td width="40%"></Td>
      <Td></Td>
      <Td width="40%">
      </Td>
    </Tr>
  );
}

export default OriginTabEmptyRow;
