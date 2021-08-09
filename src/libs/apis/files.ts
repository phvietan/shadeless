import { GenericApi } from './types';
import storage from 'libs/storage';
import { HeuristicValidator } from 'libs/heuristic.validator';
import { ErrorType, MyError } from 'libs/error';

export class FilesApi extends GenericApi {
  static NUMBER_OF_CHARACTER_NON_READDABLE = 200;
  static MAXIMUM_CHARACTERS = 1024 * 4; // View 4KB max
  static ERROR_FILE_NOT_FOUND = 'Shadeless error status 0x404: file not found';

  private static validator = new HeuristicValidator();
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

  async getFileContentFromId (id: string): Promise<[string, MyError | null]> {
    const endpoint = `${this.endpoint}${storage.getProject()}/${id}`;
    const data = await fetch(endpoint);
    const header = data.status;
    if (header === 404) {
      return ['', new MyError(ErrorType.FILE_RESPONSE_NOT_FOUND)];
    }
    let response = await data.text();
    if (FilesApi.validator.isNonReadableString(response)) {
      response = response.slice(0, FilesApi.NUMBER_OF_CHARACTER_NON_READDABLE);
      return [response, new MyError(ErrorType.FILE_RESPONSE_NON_READDABLE)];
    }
    if (response.length > FilesApi.MAXIMUM_CHARACTERS) {
      response = response.slice(0, FilesApi.MAXIMUM_CHARACTERS);
      return [response, new MyError(ErrorType.FILE_RESPONSE_TOO_LONG)];
    }
    return [response, null];
  }
}
