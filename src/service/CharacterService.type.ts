import { DnDCharacter } from 'dnd-character-sheets';
import { HubdbFindAllElementResponse } from './hubdb.type';

export interface CharacterServiceInterface {
  findAll(): Promise<HubdbFindAllElementResponse[]>;

  add(character: CustomDnDCharacter): Promise<string>;
}

export default class CustomDnDCharacter extends DnDCharacter {
  id?: string;
}
