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
import { Link, useLocation } from 'wouter';
import { HamburgerIcon } from '@chakra-ui/icons';
import storage from 'libs/storage';

function Navbar () {
  const setLocation = useLocation()[1];
  const choosingProject = storage.getProject();
  return (
    <Flex
      bg="background.primary-green"
      px={4}
      color="background.primary-white"
      boxShadow="xs"
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <HStack spacing={8} alignItems={'center'}>
          <Text
            as="h1"
            fontSize="4xl"
            p="10px"
            ml="10%"
            mr="5%"
          >
            <Link href="/">Shadeless</Link>
          </Text>

        <Link href="/domains">Domains</Link>
      </HStack>
      <Menu>
        <MenuButton as={Button}
          bg="background.600"
          mr="5%"
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
          >
            Choosing project: {choosingProject}
          </Text>
          <HamburgerIcon />
        </MenuButton>
        <MenuList color="background.primary-black">
          <MenuItem onClick={() => setLocation('/projects')}>
            Choose project
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default Navbar;
