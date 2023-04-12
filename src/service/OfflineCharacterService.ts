import CustomDnDCharacter, { CharacterServiceInterface } from './CharacterService.type';

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

  add(_character: CustomDnDCharacter): Promise<string> {
    return Promise.resolve(this.generateId(10));
  }
}
