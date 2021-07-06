import React from 'react';
import {
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { Link } from 'wouter';
import { HamburgerIcon } from '@chakra-ui/icons';
import { getCookie } from 'libs/cookie';

function Navbar () {
  const choosingProject = getCookie('project');
  return (
    <Flex
      bg="background.primary-green"
      px={4}
      h={14}
      color="background.primary-white"
      boxShadow="xs"
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <HStack spacing={8} alignItems={'center'}>
        <Link href="/">Shadeless</Link>
        <Link href="/projects">Projects</Link>
      </HStack>
      <Menu>
        <MenuButton as={Button}
          bg="background.600"
          _hover={{
            bg: 'background.600',
          }}
          _active={{
            bg: 'background.600',
          }}
        >
          <Text
            as="i"
            size="xs"
            mr="25px"
            fontWeight="100"
          >Choosing project: {choosingProject}</Text>
          <HamburgerIcon />
        </MenuButton>
        <MenuList color="background.primary-black">
          <MenuItem>Configuration</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default Navbar;
