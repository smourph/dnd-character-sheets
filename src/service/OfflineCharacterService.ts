import CustomDnDCharacter, { CharacterServiceInterface } from './CharacterService.type';
import { HubdbFindAllElementResponse } from './hubdb.type';

export default class OfflineCharacterService implements CharacterServiceInterface {

  generateId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  findAll(): Promise<HubdbFindAllElementResponse[]> {
    return Promise.resolve([]);
  }

  add(_character: CustomDnDCharacter): Promise<string> {
    return Promise.resolve(this.generateId(10));
  }

  update(_character: CustomDnDCharacter): Promise<void> {
    return Promise.resolve();
  }
}
