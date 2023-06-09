import * as Hubdb from 'hubdb';
import CustomDnDCharacter, { CharacterServiceInterface } from './CharacterService.type';
import { HubdbFindAllElementResponse } from './hubdb.type';
import config from '../config';

export default class OnlineCharacterService implements CharacterServiceInterface {
  private db;

  constructor() {
    const options = config.hubdb;
    this.db = Hubdb.default(options);
  }

  findAll(): Promise<HubdbFindAllElementResponse[]> {
    return new Promise((resolve, reject) =>
      this.db.list((error: Error, response: PromiseLike<HubdbFindAllElementResponse[]> | HubdbFindAllElementResponse[]) => {
        if (error) {
          return reject(error);
        }
        resolve(response);
      })
    );
  }

  add(character: CustomDnDCharacter): Promise<string> {
    return new Promise((resolve, reject) =>
      this.db.add(character, (error: Error, _result: PromiseLike<object> | object, id: string) => {
        if (error) {
          return reject(error);
        }
        resolve(id);
      })
    );
  }

  update(character: CustomDnDCharacter): Promise<void> {
    return new Promise((resolve, reject) => {
      if (character.id && character.id !== '') {
        this.db.update(character.id, character, (error: Error, _result: PromiseLike<CustomDnDCharacter> | CustomDnDCharacter, _id: string) => {
          console.log('error', error);
          console.log('_result', _result);
          console.log('_id', _id);
          if (error) {
            return reject(error);
          }
          resolve();
        });
      } else {
        return reject('Character ID is mandatory, null, empty or undefined given');
      }
    });
  };
}
