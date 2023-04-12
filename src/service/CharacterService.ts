import { CharacterServiceInterface } from './CharacterService.type';
import OnlineCharacterService from './OnlineCharacterService';
import OfflineCharacterService from './OfflineCharacterService';
import config from '../config';

export const characterService: CharacterServiceInterface = config.online && config.hubdb ?
  new OnlineCharacterService() :
  new OfflineCharacterService();
