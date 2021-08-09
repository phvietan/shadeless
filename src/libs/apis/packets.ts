/* eslint-disable camelcase */
import { GenericApi, GenericApiResponse } from './types';
import storage from 'libs/storage';

export type MetaData = {
  origins: string[];
  parameters: string[];
  reflectedParameters: Record<string, string>;
}

export type Packet = {
  requestPacketId: string;
  requestPacketPrefix: string;
  requestPacketIndex: number;

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
  reflectedParameters: Record<string, string>;
  codeName: string;

  created_at?: string;
}

export const defaultMetaData: MetaData = {
  origins: [],
  parameters: [],
  reflectedParameters: {},
};

export const defaultPacket: Packet = {
  requestPacketId: '',
  requestPacketIndex: 0,
  requestPacketPrefix: '',
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
  reflectedParameters: {},
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

  // Get TimeTravel Packets in: [left; left+number)
  async getTimeTravelPacketsByPrefixAndRange (prefix: string, left: number, number: number) {
    const endpoint = this.endpoint + storage.getProject() + '/timeTravel';
    const params = { requestPacketId: `${prefix}.${left}`, number: number.toString() };
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();
    const data = await fetch(url.toString());
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: Packet[] };
  }

  // Get TimeTravel Packets in: [-range; +range]
  async getTimeTravelPacketsById (requestPacketId: string, range: number) {
    const arr = requestPacketId.split('.');
    const [prefix, idx] = arr;
    if (arr.length !== 2) {
      const response: Omit<GenericApiResponse, 'data'> & { data: Packet[] } = {
        statusCode: 400,
        error: 'Wrong requestPacketId format',
        data: [],
      };
      return response;
    }
    return this.getTimeTravelPacketsByPrefixAndRange(
      prefix,
      Math.max(1, parseInt(idx) - range),
      range * 2 + 1,
    );
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
