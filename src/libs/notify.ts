import { ToastId, UseToastOptions } from '@chakra-ui/react';
import { StringApiResponse } from './apis/types';

type ToastType = {
  (options?: UseToastOptions | undefined): string | number | undefined;
  close: (id: ToastId) => void;
  closeAll: (...args: any[]) => void;
  update(id: ToastId, options: Pick<UseToastOptions, 'position' | 'onCloseComplete' | 'duration' | 'title' | 'status' | 'render' | 'description' | 'isClosable' | 'variant'>): void;
  isActive: (id: ToastId) => boolean | undefined;
}

const HTTP_STATUS_OK = 200;

export function notify (toast: ToastType, response: StringApiResponse) {
  const status = (response.statusCode === HTTP_STATUS_OK) ? 'success' : 'error';
  const title = (status === 'success') ? 'Success' : 'Error';
  const description = (status === 'success') ? response.data : response.error;
  toast({
    title,
    status,
    description,
    duration: 3000,
    isClosable: true,
  });
}
