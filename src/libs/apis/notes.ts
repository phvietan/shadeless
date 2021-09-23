import { GenericApi, GenericApiResponse, StringApiResponse } from './types';
import storage from 'libs/storage';

export type Reply = {
  userId: string,
  description: string,
}

export interface Note {
  id?: string,
  codeName: string,
  tags: string,
  description: string,
  requestPacketId: string,
  replies: Reply[],
  updated_at?: Date,
  created_at?: Date,
}

export const defaultNote: Note = {
  codeName: '',
  tags: '',
  description: '',
  requestPacketId: '',
  replies: [],
};

export class NotesApi extends GenericApi {
  private static instance?: NotesApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new NotesApi();
    }
    return this.instance;
  }

  async getNotesInCurrentProject () {
    const endpoint = `${this.endpoint}${storage.getProject()}/notes`;
    const resp = await fetch(endpoint);
    const allNotes = await resp.json();
    return allNotes as Omit<GenericApiResponse, 'data'> & { data: Note[] };
  }

  async createNote (newNote: Note) {
    const endpoint = `${this.endpoint}${storage.getProject()}/notes`;
    const resp = await fetch(endpoint, {
      ...GenericApi.postOptions,
      body: JSON.stringify(newNote),
    });
    return resp.json() as Promise<StringApiResponse>;
  }
}
