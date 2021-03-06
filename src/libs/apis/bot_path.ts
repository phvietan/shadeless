/* eslint-disable no-unused-vars */
import { GenericApi, GenericApiResponse, StringApiResponse } from './types';
import storage from 'libs/storage';

export const defaultBotPath: BotPath = {
  id: '',
  timeout: 0,
  project: '',
  running: false,
  asyncRequest: 0,
  sleepRequest: 0,
};

export type BotPath = {
  id?: string,
  timeout: number,
  project: string,
  running: boolean,
  asyncRequest: number,
  sleepRequest: number,
};

export class BotPathApi extends GenericApi {
  private static instance?: BotPathApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new BotPathApi();
    }
    return this.instance;
  }

  async getBotPath () {
    const endpoint = this.endpoint + storage.getProject() + '/bot_path';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: BotPath };
  }

  async updateBotPath (newBotPath: Partial<BotPath>) {
    const endpoint = this.endpoint + storage.getProject() + '/bot_path';
    const data = await fetch(endpoint, {
      ...GenericApi.putOptions,
      body: JSON.stringify(newBotPath),
    });
    const response = await data.json();
    return response as StringApiResponse;
  }

  async switchBotPath () {
    const endpoint = this.endpoint + storage.getProject() + '/bot_path/run';
    const data = await fetch(endpoint, GenericApi.putOptions);
    const response = await data.json();
    return response as StringApiResponse;
  }
}
