import { GenericApi, GenericApiResponse } from './types';
import storage from 'libs/storage';

export interface User {
  id?: string,
  codeName: string,
  project: string,
  color: string,
}

export const defaultUser: User = {
  codeName: '',
  project: '',
  color: '',
};

export class UsersApi extends GenericApi {
  private static instance?: UsersApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new UsersApi();
    }
    return this.instance;
  }

  async getUsersInCurrentProject () {
    const endpoint = `${this.endpoint}${storage.getProject()}/users`;
    const resp = await fetch(endpoint);
    const allNotes = await resp.json();
    return allNotes as Omit<GenericApiResponse, 'data'> & { data: User[] };
  }
}
