/* eslint-disable no-unused-vars */
import { GenericApi, GenericApiResponse, StringApiResponse } from './types';

export enum ProjectStatus {
  TODO = 'todo',
  HACKING = 'hacking',
  DONE = 'done',
}

export enum BlacklistType {
  BLACKLIST_REGEX = 'regex',
  BLACKLIST_VALUE = 'value',
}

export function convertStringToBlacklistType (s: string): BlacklistType {
  if (s === BlacklistType.BLACKLIST_REGEX) return BlacklistType.BLACKLIST_REGEX;
  return BlacklistType.BLACKLIST_VALUE;
}

export type Blacklist = {
  value: string,
  type: BlacklistType,
}

export const defaultProject: Project = {
  id: '',
  name: '',
  description: '',
  status: ProjectStatus.TODO,
  blacklist: [],
  createdAt: new Date(),
};

export type Project = {
  id: string,
  name: string,
  description: string,
  status: ProjectStatus,
  blacklist: Blacklist[],
  createdAt: Date,
};

export class ProjectsApi extends GenericApi {
  private static instance?: ProjectsApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new ProjectsApi();
    }
    return this.instance;
  }

  async getOne (name: string) {
    const project = await super.getOne(name);
    return project as Omit<GenericApiResponse, 'data'> & { data: Project };
  }

  async getAll () {
    const allProjects = await super.getAll();
    return allProjects as Omit<GenericApiResponse, 'data'> & { data: Project[] };
  }

  async create (body: { name: string; description: string }) {
    const response = await super.post(body);
    return response as StringApiResponse;
  }

  async editStatus (status: ProjectStatus, identifier: string) {
    const response = await super.put({ status }, identifier + '/status');
    return response as StringApiResponse;
  }

  async edit (body: Partial<Project>, identifier?: string) {
    const response = await super.put(body, identifier);
    return response as StringApiResponse;
  }

  async delete (identifier: string, options: any = {}) {
    const response = await super.delete(identifier, options);
    return response as StringApiResponse;
  }
}
