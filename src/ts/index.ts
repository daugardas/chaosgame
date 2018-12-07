import 'reset-css';
import '../css/style.css';
import { addPrevious } from './ConfigChangeHandlers';
import { Game } from './Game';

export let gameInstance = new Game();

gameInstance.start();
addPrevious();