import React from 'react';
import { Box, SkeletonText, Text } from '@chakra-ui/react';
import { FilesApi } from 'libs/apis/files';

type Props = {
  reflectedParameters: Record<string, string>;
  isLoading: boolean;
  content: string;
};
function TimeTravelBody (props: Props) {
  const { content, isLoading, reflectedParameters } = props;
  console.log(reflectedParameters);

  if (content === FilesApi.ERROR_FILE_NOT_FOUND) {
    return (
      <Text
        as="i"
        color="red"
      >
        {content}
      </Text>
    );
  }

  return (
    <Box
      p="3%"
      border="1px solid LightGray"
    >
      {isLoading &&
        <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
      }
      {/* <Text whiteSpace='pre-wrap' as="span">
        {content.split()}
      </Text> */}
    </Box>
  );
}

export default TimeTravelBody;
