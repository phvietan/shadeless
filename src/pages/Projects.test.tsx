/* eslint-disable no-var */
import React from 'react';
import { PacketsApi } from 'libs/apis/packets';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ProjectsPage from './Projects';

var container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

var packetApiInstance = PacketsApi.getInstance();

beforeAll(() => {
  packetApiInstance.getMetaData = async () => {
    return {
      statusCode: 200,
      data: {
        origins: [],
        parameters: [],
        reflectedParameters: {}
      },
      error: '',
    };
  };
});
describe('Test', () => {
  test('render app', () => {
    act(() => {
      render(<ProjectsPage />, container);
    });
  });
});
