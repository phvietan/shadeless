import React from 'react';
import { Grid } from '@chakra-ui/layout';

type Props = {
  id?: string;
  children: any;
  isFocus?: boolean;
}
function TabHeader (props: Props) {
  const { children, isFocus, id } = props;
  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      bg={isFocus ? 'background.focus-orange' : 'background.primary-black'}
      borderRadius="5px 0px"
      id={id}
      p="10px"
      px="2%"
      color={isFocus ? 'background.focus-white' : 'white'}
    >
      {children}
    </Grid>
  );
}

export default TabHeader;
