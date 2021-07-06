/* eslint-disable no-unused-vars */
import { GenericApi, GenericApiResponse, StringApiResponse } from './types';

export enum ProjectStatus {
  TODO = 'todo',
  HACKING = 'hacking',
  DONE = 'done',
}

export type Project = {
  id: string,
  name: string,
  description: string,
  status: ProjectStatus,
  projectStatus: ProjectStatus,
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

  async getAll () {
    const allProjects = await super.getAll();
    return allProjects as Omit<GenericApiResponse, 'data'> & { data: Project[] };
  }

  async create (body: { name: string; description: string }) {
    const response = await super.post(body);
    return response as StringApiResponse;
  }

  async edit (body: Partial<Project>, identifier?: string) {
    const response = await super.put(body, identifier);
    return response as StringApiResponse;
  }

  async delete (identifier: string) {
    const response = await super.delete(identifier);
    return response as StringApiResponse;
  }
}
