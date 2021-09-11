import dbManager from './db/db_manager';

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

  async getNumPacketsOfOriginByProject (origin: string): Promise<number> {
    const project = this.getProject();
    const num = await dbManager.pppStore.read(project, origin);
    if (!num) {
      await dbManager.pppStore.write(project, origin, Storage.DEFAULT_PACKETS_PER_PAGE);
      return Storage.DEFAULT_PACKETS_PER_PAGE;
    }
    return num;
  }

  async setNumPacketsOfOriginByProject (origin: string, newVal: number) {
    const project = this.getProject();
    await dbManager.pppStore.update(project, origin, newVal);
  }

  async cleanNumPacketsPerPage () {
    await dbManager.pppStore.deleteAll();
  }
}

const MyStorage = new Storage();
export default MyStorage;
