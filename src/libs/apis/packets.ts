import { GenericApi, GenericApiResponse } from './types';
import storage from 'libs/storage';

export type MetaData = {
  origins: string[];
  parameters: string[];
  reflectedParameters: string[];
}

export type Packet = {
  toolName: string;
  method: string
  requestLength: number;
  requestHttpVersion: string;
  requestContentType: string;
  referer: string;
  protocol: string;
  origin: string;
  port: number;
  path: string;
  requestCookies: string;
  hasBodyParam: boolean;
  querystring: string;
  requestBodyHash: string;
  parameters: string[];
  requestHeaders: string[];

  responseStatus: number;
  responseContentType: string;
  responseStatusText: string;
  responseLength: number;
  responseMimeType: string;
  responseHttpVersion: string;
  responseInferredMimeType: string;
  responseCookies: string;
  responseBodyHash: string;
  responseHeaders: string[];

  rtt: number;
  reflectedParameters: string[];
  codeName: string;
}

export const defaultMetaData: MetaData = {
  origins: [],
  parameters: [],
  reflectedParameters: [],
};

export const defaultPacket: Packet = {
  toolName: '',
  method: '',
  requestLength: 0,
  requestHttpVersion: '',
  requestContentType: '',
  referer: '',
  protocol: '',
  origin: '',
  port: 0,
  path: '',
  requestCookies: '',
  hasBodyParam: false,
  querystring: '',
  requestBodyHash: '',
  parameters: [],
  requestHeaders: [],

  responseStatus: 0,
  responseContentType: '',
  responseStatusText: '',
  responseLength: 0,
  responseMimeType: '',
  responseHttpVersion: '',
  responseInferredMimeType: '',
  responseCookies: '',
  responseBodyHash: '',
  responseHeaders: [],

  rtt: 0,
  reflectedParameters: [],
  codeName: '',
};

export class PacketsApi extends GenericApi {
  private static instance?: PacketsApi = undefined;

  private constructor () {
    super('projects');
  }

  public static getInstance () {
    if (!this.instance) {
      this.instance = new PacketsApi();
    }
    return this.instance;
  }

  async getMetaData () {
    const endpoint = this.endpoint + storage.getProject() + '/metadata';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: MetaData };
  }

  async getNumberPacketsByOrigin (origin: string) {
    const endpoint = this.endpoint + storage.getProject() + '/numberPackets';
    const params = { origin };
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();

    const data = await fetch(url.toString());
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: number };
  }

  async getPacketsByOrigin (origin: string, skip: number, limit: number) {
    const endpoint = this.endpoint + storage.getProject() + '/packets';
    const params = { origin, skip: skip.toString(), limit: limit.toString() };
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();

    const data = await fetch(url.toString());
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: Packet[] };
  }
}
