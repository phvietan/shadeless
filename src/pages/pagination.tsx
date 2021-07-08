import React from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  id: string;
  page: number;
  maxPage: number;
  setPage: (n: number) => void;
}

const PAGINATION_NUM_SHOW = 2;

type PaginationButtonProps = {
  children: number;
  onClick: () => void;
}
const PaginationButton = (props: PaginationButtonProps) => {
  const { children, onClick } = props;
  return (
    <Button
      onClick={onClick}
      colorScheme="orange"
    >
      {children}
    </Button>
  );
};

function Pagination (props: Props) {
  const { page, maxPage, setPage, id } = props;

  const arrPages = [];
  for (let i = page - PAGINATION_NUM_SHOW; i <= page + PAGINATION_NUM_SHOW; i += 1) { if (i >= 1 && i <= maxPage) arrPages.push(i); }

  return (
    <>
      {page > 3 &&
        <>
          <PaginationButton onClick={() => setPage(1)}>{1}</PaginationButton>
          ...
          ...
        </>
      }

      {arrPages.map(p =>
        <PaginationButton onClick={() => setPage(p)} key={`${id}-pagin-${p}`}>{p}</PaginationButton>
      )}

      {page < maxPage - 2 &&
        <>
          ...
          ...
          <PaginationButton onClick={() => setPage(maxPage)}>{maxPage}</PaginationButton>
        </>
      }
    </>
  );
}

export default Pagination;
