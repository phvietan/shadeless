import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';

type Props = {
  isDisabled?: boolean;
  isSubmitting?: boolean;
  onClick: (...args: any[]) => void;
  colorScheme?: string;
  ml?: string;
  mt?: string;
  children: any;
}
function SubmitButton (props: Props) {
  return (
    <Button
      {...props}
      isLoading={props.isSubmitting}
      loadingText="Submitting"
    >
      {props.isSubmitting && <Spinner />}{props.children}
    </Button>
  );
}

export default SubmitButton;
