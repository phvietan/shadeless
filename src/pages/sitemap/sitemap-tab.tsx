import React from 'react';
import { ParsedPath, ParsedPathApi } from 'libs/apis/parsed_paths';
import SiteMapTabHeader from './sitemap-tab-header';
import { Box, Table, Thead, Tr, Th, SkeletonText, Tbody } from '@chakra-ui/react';
import TableSortButton from 'pages/common/table-sort-button';
import SiteMapTabRow from './sitemap-tab-row';

const parsedPathsApiInstance = ParsedPathApi.getInstance();

type Props = {
  origin: string;
};
function SiteMapTab (props: Props) {
  const { origin } = props;
  const [isLoading, setIsLoading] = React.useState(true);
  const [parsedPaths, setParsedPaths] = React.useState<ParsedPath[]>([]);

  React.useEffect(() => {
    const getParsedPaths = async () => {
      const resp = await parsedPathsApiInstance.getCurrentProjectParsedPathByOrigin(origin);
      setIsLoading(false);
      setParsedPaths(resp.data);
      console.log(origin, resp.data);
    };
    getParsedPaths();
  }, []);

  return (
    <Box my="50px">
      <SiteMapTabHeader
        id={`sitemap-${origin}`}
        origin={origin}
        numPaths={parsedPaths.length}
      />

      {isLoading
        ? <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
        : <Table
            size="sm"
            fontSize="xs"
            variant="striped"
            colorScheme="blackAlpha"
          >
            <Thead>
              <Tr>
                <Th>Action</Th>
                <Th>
                  <TableSortButton
                    kkey="path"
                    array={parsedPaths}
                    setArray={setParsedPaths}
                  >
                    Path
                  </TableSortButton>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {parsedPaths.map(parsedPath =>
                <SiteMapTabRow
                  key={`${origin}/${parsedPath._id}`}
                  parsedPath={parsedPath}
                />
              )}
            </Tbody>
          </Table>
        }

    </Box>
  );
}

export default SiteMapTab;
