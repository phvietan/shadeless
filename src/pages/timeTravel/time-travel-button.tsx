import { Button } from '@chakra-ui/react';

type PaginationButtonProps = {
  children?: any;
  onClick?: () => void;
}
const TimeTravelButton = (props: PaginationButtonProps) => {
  const { children, onClick } = props;

  return (
    <Button
      onClick={onClick}
      size="sm"
      borderRadius="2px"
      ml="4px"
      bg="black"
      color="white"
      _hover={{
        bg: 'grey',
      }}
      _active={{
        bg: 'grey',
      }}
    >
      { children }
    </Button>
  );
};

export default TimeTravelButton;
