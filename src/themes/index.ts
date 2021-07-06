import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config : ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};
const colors = {
  background: {
    'primary-black': '#0B2B5A',
    'primary-green': '#175020',
    'primary-white': 'white',
    'primary-grey': '#EAF6EC'
  }
};
const fonts = {
  heading: 'Chakra Petch',
  body: 'Chakra Petch',
};
const theme = extendTheme({ colors, config, fonts });

export default theme;
