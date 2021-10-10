/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { GenericApi, GenericApiResponse } from './types';
import storage from 'libs/storage';

export enum PathStatus {
  TODO = 'todo',
  SCANNING = 'scanning',
  DONE = 'done',
};
export enum PathType {
  FILE = 'file',
  FOLDER = 'folder',
};
export interface ParsedPath {
  _id?: string;
  requestPacketId: string;
  origin: string;
  path: string;
  status: PathStatus;
  project: string;
  force: boolean;
  created_at?: Date;
  updated_at?: Date;
  type: PathType;
  error: string;
}

export const defaultParsedPath: ParsedPath = {
  requestPacketId: '',
  origin: '',
  path: '',
  status: PathStatus.TODO,
  project: '',
  force: false,
  type: PathType.FILE,
  error: '',
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

  async getCurrentProjectParsedPathByOrigin (origin: string) {
    const endpoint = this.endpoint + storage.getProject() + '/paths';
    const url = new URL(endpoint);
    url.search = new URLSearchParams({ origin }).toString();

    const data = await fetch(url.toString());
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: ParsedPath[] };
  }
}
