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
import storage from 'libs/storage';

function Navbar () {
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

        <Link href="/notes">Notes</Link>
        <Link href="/sitemap">Sitemap</Link>
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
            Choosing project: <strong>&nbsp;{choosingProject}</strong>
          </Text>
          <HamburgerIcon />
        </MenuButton>
        <MenuList color="background.primary-black">
          <Link href={'/projects/' + choosingProject}>
            <MenuItem>
              Config <strong>&nbsp;{choosingProject}</strong>
            </MenuItem>
          </Link>
          <Link href={'/setting'}>
            <MenuItem>
              Choose project
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default Navbar;
