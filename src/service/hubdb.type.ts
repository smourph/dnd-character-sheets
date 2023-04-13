import CustomDnDCharacter from './CharacterService.type';

/**
 * hubdb object
 * @memberof Hubdb
 * @alias Hubdb
 * @typedef {object} Hubdb
 * @property {callback: Function => void} list
 * @property {(id: string, data: any, callback: Function) => void} update
 * @property {(id: string, callback: Function) => void} remove
 * @property {(id: string, callback: Function) => void} get
 * @property {(data: any, callback: Function) => void} add
 */
export interface Hubdb {
  list: (callback: Function) => void;
  update: (id: string, data: any, callback: Function) => void;
  remove: (id: string, callback: Function) => void;
  get: (id: string, callback: Function) => void;
  add: (data: any, callback: Function) => void;
}

export interface HubdbFindAllElementResponse {
  path: string;
  data: CustomDnDCharacter;
}

/**
 * hubdb configuration object
 * @memberof Hubdb
 * @alias HubdbOptions
 * @typedef {object} HubdbOptions
 * @property {string} username - the user's name of the repository. this is not necessary the user that's logged in
 * @property {string} repo     - the repository name
 * @property {string} branch   - the branch of the repository to use as a database
 * @property {string} token    - a GitHub token. You'll need to get this by OAuthing into GitHub or use an applicaton token
 */
export interface HubdbOptions {
  username: string;
  repo: string;
  branch: string;
  token: string;
}
