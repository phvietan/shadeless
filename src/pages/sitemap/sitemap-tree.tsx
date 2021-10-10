import React from 'react';
import { Box } from '@chakra-ui/react';
import { SiteMapObject } from './sitemap-object';
// import FolderTree, { testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

type Props = {
  tree: SiteMapObject;
  depth?: number;
}
function SiteMapTree (props: Props) {
  let { tree, depth } = props;
  console.log(tree);

  if (!depth) depth = 0;
  const marginLeft = depth * 5 + 'px';
  // const onTreeStateChange = (state: any, event: any) => console.log(state, event);

  return (
    <Box
      ml={marginLeft}
    >
      {/* <FolderTree
        data={testData}
        onChange={ onTreeStateChange }
      /> */}
      {tree.name}
      {tree.children.map(node =>
        <SiteMapTree
          key={`tree-${node.name}`}
          tree={node}
          depth={(depth || 0) + 1}
        />
      )}
    </Box>
  );
}

export default SiteMapTree;
