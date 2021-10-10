import { ParsedPath, PathType } from 'libs/apis/parsed_paths';

/* eslint-disable no-unused-vars */
export type SiteMapObject = {
  type: PathType,
  name: string,
  children: SiteMapObject[],
};

export type SiteMapMetadata = {
  origins: string[],
  scanning: string,
  numPaths: number,
  numFound: number,
  numScanned: number,
}
export const sitemapMetadataDefault = {
  origins: [],
  scanning: '',
  numPaths: 0,
  numFound: 0,
  numScanned: 0,
};

export const siteMapObjectDefault = {
  type: PathType.FOLDER,
  name: '/',
  children: [],
};

function getParentPath (currentPath: string): string {
  currentPath = currentPath.replace('\\', '/');
  if (currentPath === '/') return '';
  let splitted = currentPath.split('/');
  if (currentPath[currentPath.length - 1] === '/') splitted = splitted.slice(0, splitted.length - 2); else {
    splitted = splitted.slice(0, splitted.length - 1);
  }
  return splitted.join('/') + '/';
}

function getFileNameFromPath (path: string): string {
  path = path.replace('\\', '/');
  if (path === '') return '/';
  const splitted = path.split('/');
  if (path[path.length - 1] === '/') return splitted[splitted.length - 2];
  else return splitted[splitted.length - 1];
}

function getSiteMapStructureFromMap (root: ParsedPath, adjNodes: Map<string, ParsedPath[]>): SiteMapObject {
  const children = adjNodes.get(root.path);
  if (!children) {
    return {
      children: [],
      type: root.type,
      name: getFileNameFromPath(root.path),
    };
  }
  const current: SiteMapObject = {
    type: root.type,
    name: getFileNameFromPath(root.path),
    children: children.map(child => getSiteMapStructureFromMap(child, adjNodes)),
  };
  return current;
}

export function fromParsedPathsToSiteMapObject (parsedPaths: ParsedPath[]) {
  const adjNodes = new Map<string, ParsedPath[]>();
  parsedPaths.forEach(parsedPath => {
    const parent = getParentPath(parsedPath.path);
    const parentNode = adjNodes.get(parent) || [];
    parentNode.push(parsedPath);
    adjNodes.set(parent, parentNode);
  });
  const rootNode = parsedPaths.find(node => node.path === '/');
  if (!rootNode) {
    return {
      type: PathType.FOLDER,
      name: '/',
      children: [],
    };
  }
  return getSiteMapStructureFromMap(rootNode, adjNodes);
}
