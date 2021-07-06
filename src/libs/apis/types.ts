export interface GenericApiResponse {
  statusCode: number;
  data: unknown;
  error: string;
}

// Type for apis that return string (for example)
export interface StringApiResponse extends GenericApiResponse {
  data: string;
}

export class GenericApi {
  endpoint = '';
  static jsonOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  static postOptions = {
    ...GenericApi.jsonOptions,
    method: 'POST',
  };

  static putOptions = {
    ...GenericApi.jsonOptions,
    method: 'PUT',
  };

  static deleteOptions = {
    ...GenericApi.jsonOptions,
    method: 'DELETE',
  };

  static backendUrl = process.env.REACT_APP_BACKEND_URL;

  constructor (endpoint: string) {
    if (!endpoint.startsWith('/')) endpoint = '/' + endpoint;
    if (!endpoint.endsWith('/')) endpoint = endpoint + '/';
    this.endpoint = GenericApi.backendUrl + endpoint;
  }

  protected async getAll (): Promise<any> {
    const data = await fetch(this.endpoint);
    const response = await data.json();
    return response;
  }

  protected async getOne (identifier: string): Promise<any> {
    const data = await fetch(this.endpoint + identifier);
    const response = await data.json();
    return response;
  }

  protected async post (body: any): Promise<any> {
    const data = await fetch(this.endpoint, {
      ...GenericApi.postOptions,
      body: JSON.stringify(body),
    });
    const response = await data.json();
    return response;
  }

  protected async put (body: any, identifier?: string): Promise<any> {
    const data = await fetch(this.endpoint + identifier, {
      ...GenericApi.putOptions,
      body: JSON.stringify(body),
    });
    const response = await data.json();
    return response;
  }

  protected async delete (identifier: string): Promise<any> {
    const data = await fetch(this.endpoint + identifier, GenericApi.deleteOptions);
    const response = await data.json();
    return response;
  }
}
