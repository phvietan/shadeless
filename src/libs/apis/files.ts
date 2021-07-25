import { GenericApi } from './types';
import storage from 'libs/storage';

export class FilesApi extends GenericApi {
  static MAXIMUM_CHARACTERS = 1024 * 20; // View 20KB max
  static ERROR_FILE_NOT_FOUND = 'Shadeless error status 0x404: file not found';

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
    const header = data.status;
    if (header === 404) {
      return FilesApi.ERROR_FILE_NOT_FOUND;
    }
    let response = await data.text();
    if (response.length > FilesApi.MAXIMUM_CHARACTERS) {
      response = response.slice(0, FilesApi.MAXIMUM_CHARACTERS);
      response += ' ..... | The response is too long, please download if you want to see whole file';
    }
    return response.replace(' ', ' ');
  }
}
