import React from 'react';
import { Box, Link, Text } from '@chakra-ui/layout';
import storage from 'libs/storage';
import TabHeader from 'pages/common/tab-header';

type Props = {
  origin: string;
  isFocus: boolean;
  numEndpoints: number;
  packetsPerPage: number;
  setPacketsPerPage: React.Dispatch<React.SetStateAction<number>>;
}
function OriginTabHeader (props: Props) {
  const { isFocus, numEndpoints, packetsPerPage, setPacketsPerPage, origin } = props;

  const changeNumPacketsPerPage = async (chooseObj : React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = chooseObj.target;
    setPacketsPerPage(parseInt(value));
    await storage.setNumPacketsOfOriginByProject(origin, parseInt(value));
  };

  return (
    <TabHeader
      isFocus={isFocus}
      id={origin}
    >
      <Box display="inline">
        <Link
          display="inline"
          justifySelf="start"
          href={'/#' + origin}
        >
          {origin}
        </Link>
        <select
          style={{
            color: 'black',
            marginLeft: '10px',
            fontSize: '14px',
          }}
          value={packetsPerPage}
          onChange={changeNumPacketsPerPage}
        >
          <option value="15">15</option>
          <option value="40">40</option>
          <option value="70">70</option>
          <option value="100">100</option>
        </select>
      </Box>

      <Text as="h1" justifySelf="end">
        {numEndpoints} endpoints
      </Text>
    </TabHeader>
  );
}

export default OriginTabHeader;
