import { GenericApi } from './types';
import storage from 'libs/storage';

export class FilesApi extends GenericApi {
  static MAXIMUM_CHARACTERS = 1024 * 1024; // 1 million characters

  private static instance?: FilesApi = undefined;

  private constructor () {
    super('files');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new FilesApi();
    }
    return this.instance;
  }

  async getFileContentFromId (id: string) {
    const endpoint = `${this.endpoint}${storage.getProject()}/${id}`;
    const data = await fetch(endpoint);
    const response = await data.text();
    return response.slice(0, FilesApi.MAXIMUM_CHARACTERS);
  }
}
