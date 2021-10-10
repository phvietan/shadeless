import React from 'react';
import { Button } from '@chakra-ui/button';

type TableSortButtonProps = {
  children: any;
  onClick: (...args: any[]) => any;
}
function TableSortButton (props: TableSortButtonProps) {
  const { children, onClick } = props;
  return (
    <Button
      onClick={onClick}
      bg="transparent"
    >
      ↑↓ {children}
    </Button>
  );
}
export default TableSortButton;
