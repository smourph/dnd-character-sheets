import { DnDCharacter } from 'dnd-character-sheets';

export interface CharacterServiceInterface {
  add(character: CustomDnDCharacter): Promise<string>;
}

export default class CustomDnDCharacter extends DnDCharacter {
  id?: string;
}
