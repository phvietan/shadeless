import React from 'react';
import { Box, SkeletonText, Text } from '@chakra-ui/react';
import { TimeTravelBodyType } from './time-travel-tab';

type Props = {
  error?: string;
  bodyType: TimeTravelBodyType
  reflectedParameters: Record<string, string>;
  isLoading: boolean;
  content: string;
};

const MARK_OPENING = '<mark style="background-color: green; color: white; padding: 1px">';
const MARK_CLOSING = '</mark>';

function escapeHtml (unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function TimeTravelBody (props: Props) {
  const {
    error,
    content,
    isLoading,
    reflectedParameters,
  } = props;

  const [htmlContent, setHtmlContent] = React.useState('');

  React.useEffect(() => {
    let contentResult = escapeHtml(content);
    const checkMarkedValue = new Map<string, boolean>();
    for (const key in reflectedParameters) {
      const val = reflectedParameters[key];
      if (!checkMarkedValue.get(val)) {
        checkMarkedValue.set(val, true);
        contentResult = contentResult.replaceAll(val, MARK_OPENING + val + MARK_CLOSING);
      }
    }
    setHtmlContent(contentResult);
  }, [content]);

  return (
    <Box
      p="3%"
      border="1px solid LightGray"
    >
      {isLoading &&
        <SkeletonText mt="30px" p="20px" noOfLines={7} spacing="4" />
      }
      {error !== '' &&
        <Text color="red">
          {error}
        </Text>
      }
      <Text whiteSpace='pre-wrap' as="span" dangerouslySetInnerHTML={{ __html: htmlContent }}>
      </Text>
    </Box>
  );
}

export default TimeTravelBody;
