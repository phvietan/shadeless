class Storage {
  static DEFAULT_PACKETS_PER_PAGE = 15;

  get (key: string): string | null {
    return localStorage.getItem(key);
  }

  set (key: string, value: string) {
    localStorage.setItem(key, value);
  }

  delete (key: string) {
    localStorage.removeItem(key);
  }

  getProject (): string {
    const project = this.get('project');
    if (!project) return '';
    return project;
  }

  getNumPacketsOfOriginByProject (origin: string): number {
    const project = this.getProject();
    const num = this.get(`numPackets-${origin}-${project}`);
    if (!num) return Storage.DEFAULT_PACKETS_PER_PAGE;
    return parseInt(num);
  }
}

const MyStorage = new Storage();
export default MyStorage;
