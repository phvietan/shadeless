/* eslint-disable no-unused-vars */
import { GenericApi, GenericApiResponse, StringApiResponse } from './types';
import storage from 'libs/storage';

export const defaultBotFuzzer: BotFuzzer = {
  id: '',
  timeout: 0,
  project: '',
  running: false,
  asyncRequest: 0,
  sleepRequest: 0,
};

export type BotFuzzer = {
  id?: string,
  timeout: number,
  project: string,
  running: boolean,
  asyncRequest: number,
  sleepRequest: number,
};

export class BotFuzzerApi extends GenericApi {
  private static instance?: BotFuzzerApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new BotFuzzerApi();
    }
    return this.instance;
  }

  async getBotFuzzer () {
    const endpoint = this.endpoint + storage.getProject() + '/bot_fuzzer';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: BotFuzzer };
  }

  async updateBotFuzzer (newBotFuzzer: Partial<BotFuzzer>) {
    const endpoint = this.endpoint + storage.getProject() + '/bot_fuzzer';
    const data = await fetch(endpoint, {
      ...GenericApi.putOptions,
      body: JSON.stringify(newBotFuzzer),
    });
    const response = await data.json();
    return response as StringApiResponse;
  }

  async switchBotFuzzer () {
    const endpoint = this.endpoint + storage.getProject() + '/bot_fuzzer/run';
    const data = await fetch(endpoint, GenericApi.putOptions);
    const response = await data.json();
    return response as StringApiResponse;
  }
}
