import { getCookie } from 'libs/cookie';
import { GenericApi, GenericApiResponse } from './types';

export type MetaData = {
  origins: string[];
  parameters: string[];
  reflectedParameters: string[];
}

export const defaultMetaData: MetaData = {
  origins: [],
  parameters: [],
  reflectedParameters: [],
};

export class PacketsApi extends GenericApi {
  private static instance?: PacketsApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new PacketsApi();
    }
    return this.instance;
  }

  async getMetaData () {
    const endpoint = this.endpoint + getCookie('project') + '/metadata';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: MetaData };
  }
}
