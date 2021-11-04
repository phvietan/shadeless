/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { GenericApi, GenericApiResponse, StringApiResponse } from './types';
import storage from 'libs/storage';
import { Note } from './notes';
import { FuzzStatus } from './parsed_paths';

export type MetaData = {
  origins: string[];
  parameters: string[];
  reflectedParameters: Record<string, string>;
}

export interface Packet {
  id?: string;
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
  updated_at?: string;
}

export interface ParsedPacket extends Packet {
  hash: string;
  result: string[];
  status: FuzzStatus;
  staticScore: number;
  logDir: string;
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

export const defaultParsedPacket: ParsedPacket = {
  ...defaultPacket,
  hash: '',
  result: [],
  staticScore: 0,
  logDir: '',
  status: FuzzStatus.TODO,
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
    return response as Omit<GenericApiResponse, 'data'> & { data: {
      notes: Note[],
      packets: ParsedPacket[],
    } };
  }

  // Get TimeTravel Packets in: [-range; +range]
  async getTimeTravelPacketsById (requestPacketId: string, range: number) {
    const arr = requestPacketId.split('.');
    const [prefix, idx] = arr;
    if (arr.length !== 2) {
      const response: Omit<GenericApiResponse, 'data'> & { data: {
        notes: Note[],
        packets: ParsedPacket[],
      } } = {
        statusCode: 400,
        error: 'Wrong requestPacketId format',
        data: { notes: [], packets: [] },
      };
      return response;
    }
    const t = await this.getTimeTravelPacketsByPrefixAndRange(
      prefix,
      Math.max(1, parseInt(idx) - range),
      range * 2 + 1,
    );
    return t;
  }

  async getPacketsByOrigin (origin: string, skip: number, limit: number) {
    const endpoint = this.endpoint + storage.getProject() + '/packets';
    const params = { origin, skip: skip.toString(), limit: limit.toString() };
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();

    const data = await fetch(url.toString());
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: ParsedPacket[] };
  }

  async getFuzzPackets () {
    type FuzzPackets = {
      done: ParsedPacket[],
      scanning: ParsedPacket[],
      todo: ParsedPacket[],
    };
    const endpoint = this.endpoint + storage.getProject() + '/fuzzing_packets/api';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: FuzzPackets };
  }

  async getStaticFuzzPackets () {
    const endpoint = this.endpoint + storage.getProject() + '/fuzzing_packets/static';
    const data = await fetch(endpoint);
    const response = await data.json();
    return response as Omit<GenericApiResponse, 'data'> & { data: ParsedPacket[] };
  }

  async putStaticFuzzPackets (id: string, newScore: number) {
    const endpoint = this.endpoint + storage.getProject() + '/fuzzing_packets/' + id + '/score';
    const data = await fetch(endpoint, {
      ...GenericApi.putOptions,
      body: JSON.stringify({ score: newScore }),
    });
    const response = await data.json();
    return response as StringApiResponse;
  }
}
