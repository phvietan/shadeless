import { GenericApi, GenericApiResponse, StringApiResponse } from './types';
import storage from 'libs/storage';
import { Packet } from './packets';

export interface Note {
  id?: string,
  codeName: string,
  tags: string,
  description: string,
  requestPacketId: string,
  updated_at?: Date,
  created_at?: Date,
}

export type ModalNote = Note & {
  path: string;
};

export const defaultNote: Note = {
  codeName: '',
  tags: '',
  description: '',
  requestPacketId: '',
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
    return allNotes as Omit<GenericApiResponse, 'data'> & { data: {
      notes: Note[],
      packets: Packet[],
    } };
  }

  async createNote (newNote: Note) {
    const endpoint = `${this.endpoint}${storage.getProject()}/notes`;
    const resp = await fetch(endpoint, {
      ...GenericApi.postOptions,
      body: JSON.stringify(newNote),
    });
    return resp.json() as Promise<StringApiResponse>;
  }

  async editNote (id: string, newNote: Note) {
    const endpoint = `${this.endpoint}${storage.getProject()}/notes/${id}`;
    const resp = await fetch(endpoint, {
      ...GenericApi.putOptions,
      body: JSON.stringify(newNote),
    });
    return resp.json() as Promise<StringApiResponse>;
  }

  async deleteNote (id: string) {
    const endpoint = `${this.endpoint}${storage.getProject()}/notes/${id}`;
    const resp = await fetch(endpoint, GenericApi.deleteOptions);
    return resp.json() as Promise<StringApiResponse>;
  }
}
