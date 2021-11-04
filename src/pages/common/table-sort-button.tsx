import React from 'react';
import { Button } from '@chakra-ui/button';

interface TableSortButtonProps<T> {
  children?: any;
  kkey?: string;
  array?: T[];
  setArray?: React.Dispatch<React.SetStateAction<T[]>>;
  onClick?: () => void;
}

function TableSortButton<T> (props: TableSortButtonProps<T>) {
  const { children, kkey, array, setArray, onClick } = props;

  async function onClickSort (kkey: string) {
    const isSorted = (arr: T[], kkey: string): boolean => {
      for (let i = 0; i < arr.length - 1; i += 1) {
        const cur: any = arr[i];
        const nxt: any = arr[i + 1];
        if (cur[kkey] > nxt[kkey]) return false;
      }
      return true;
    };
    const isReverse = isSorted(array || [], kkey) ? -1 : 1;
    const sortedArr = (array || []).slice();
    sortedArr.sort((a: any, b: any) => {
      if (a[kkey] > b[kkey]) return 1 * isReverse;
      if (a[kkey] < b[kkey]) return -1 * isReverse;
      return 0;
    });
    if (setArray) {
      setArray(sortedArr);
    }
  };

  if (!onClick) {
    return (
      <Button
        onClick={() => onClickSort(kkey || '')}
        bg="transparent"
      >
        ↑↓ {children}
      </Button>
    );
  }

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
