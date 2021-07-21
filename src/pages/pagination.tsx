import React from 'react';
import { Link, Button, Text } from '@chakra-ui/react';

type Props = {
  hrefHash?: string;
  id: string;
  page: number;
  maxPage: number;
  setPage: (n: number) => void;
}

const PAGINATION_NUM_SHOW = 2;

type PaginationButtonProps = {
  hrefHash?: string;
  children: JSX.Element;
  onClick: () => void;
  isChoosing: boolean;
}
const PaginationButton = (props: PaginationButtonProps) => {
  const { children, onClick, isChoosing, hrefHash } = props;

  if (hrefHash) {
    return (
      <Link href={'#' + hrefHash}>
        <Button
          onClick={onClick}
          colorScheme={isChoosing ? 'green' : 'orange'}
          size="sm"
          borderRadius="2px"
          ml="4px"
        >
          { children }
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={onClick}
      colorScheme={isChoosing ? 'green' : 'orange'}
      size="sm"
      borderRadius="2px"
      ml="4px"
    >
      { children }
    </Button>
  );
};
const DotsDivider = (): JSX.Element => (
  <Text
    ml="3px"
    mr="3px"
    as="span"
  >
    ...
  </Text>
);

function Pagination (props: Props) {
  const { page, maxPage, setPage, id, hrefHash } = props;

  const arrPages = [];
  for (let i = page - PAGINATION_NUM_SHOW; i <= page + PAGINATION_NUM_SHOW; i += 1) { if (i >= 1 && i <= maxPage) arrPages.push(i); }

  return (
    <>
      {page > 3 &&
        <>
          <PaginationButton
            hrefHash={hrefHash}
            onClick={() => setPage(1)}
            isChoosing={page === 1}
          >
            <Text>1</Text>
          </PaginationButton>
          {page > 2 + PAGINATION_NUM_SHOW && <DotsDivider />}
        </>
      }

      {arrPages.map(p =>
        <PaginationButton
          hrefHash={hrefHash}
          onClick={() => setPage(p)} key={`${id}-pagin-${p}`}
          isChoosing={page === p}
        >
          <Text>{p}</Text>
        </PaginationButton>
      )}

      {page < maxPage - PAGINATION_NUM_SHOW &&
        <>
          {page < maxPage - PAGINATION_NUM_SHOW - 1 && <DotsDivider />}
          <PaginationButton
            hrefHash={hrefHash}
            onClick={() => setPage(maxPage)}
            isChoosing={page === maxPage}
          >
            <Text>{maxPage}</Text>
          </PaginationButton>
        </>
      }
    </>
  );
}

export default Pagination;
