/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { GenericApi, GenericApiResponse, StringApiResponse } from './types';
import storage from 'libs/storage';

export enum FuzzStatus {
  TODO = 'todo',
  SCANNING = 'scanning',
  DONE = 'done',
  REMOVED = 'removed',
};
export interface ParsedPath {
  id?: string;
  requestPacketId: string;
  origin: string;
  path: string;
  status: FuzzStatus;
  project: string;
  created_at?: Date;
  updated_at?: Date;
  result: string[];
  error: string;
  logDir: string;
}

export const defaultParsedPath: ParsedPath = {
  requestPacketId: '',
  origin: '',
  path: '',
  status: FuzzStatus.TODO,
  project: '',
  error: '',
  result: [],
  logDir: '',
};

export type SiteMapMetadata = {
  origins: string[],
  scanning: string,
  numPaths: number,
  numFound: number,
  numScanned: number,
}
export const sitemapMetadataDefault = {
  origins: [],
  scanning: '',
  numPaths: 0,
  numFound: 0,
  numScanned: 0,
};

export class ParsedPathApi extends GenericApi {
  private static instance?: ParsedPathApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new ParsedPathApi();
    }
    return this.instance;
  }

  async getMetaData () {
    const endpoint = this.endpoint + storage.getProject() + '/paths/metadata';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: SiteMapMetadata };
  }

  async getParsedPaths () {
    type ParsedPathResult = {
      done: ParsedPath[],
      todo: ParsedPath[],
      removed: ParsedPath[],
      scanning: ParsedPath[],
    }
    const endpoint = this.endpoint + storage.getProject() + '/paths';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: ParsedPathResult };
  }

  async updateStatus (parsedPath: ParsedPath, status: FuzzStatus) {
    const endpoint = this.endpoint + storage.getProject() + '/paths/' + parsedPath.id + '/status';
    const data = await fetch(endpoint, {
      ...GenericApi.putOptions,
      body: JSON.stringify({ status }),
    });
    const response = await data.json();
    return response as StringApiResponse;
  }
}
