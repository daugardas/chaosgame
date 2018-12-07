import { gameInstance } from './index';
import { ICheckPrevious } from './Game';

function vertexCountChange(event: any): void {
  gameInstance.config.pointCount = event.target.value;
  gameInstance.start();
}
let vertexInput = document.getElementById("vertex-count") as HTMLInputElement;
vertexInput.value = '3';
vertexInput.onchange = vertexCountChange;

function sizeChange(event: any): void {
  gameInstance.config.size = event.target.value;
  gameInstance.start();
}
let sizeInput = document.getElementById("size") as HTMLInputElement;
sizeInput.oninput = sizeChange;
sizeInput.value = '1.5';

function percentageChange(event: any): void {
  gameInstance.config.percentage = event.target.value;
  gameInstance.start();
}
let percentageInput = document.getElementById("percentage") as HTMLInputElement;
percentageInput.oninput = percentageChange;
percentageInput.value = '0.5';

function rotationChange(event: any): void {
  gameInstance.config.rotation = event.target.value * Math.PI / 180;
  gameInstance.start();
}
let rotationInput = document.getElementById("rotation") as HTMLInputElement;
rotationInput.oninput = rotationChange;
rotationInput.value = '0';

function previousInputChange(event: any): void {
  console.log(event.target)
  //gameInstance.config.checkPrevious[event.target.name].value = Number(event.target.value);
  for(let i = 0; i < gameInstance.config.checkPrevious.length; i++){
    const { id } = gameInstance.config.checkPrevious[i];
    if(id === Number(event.target.name)){
      gameInstance.config.checkPrevious[i].value = Number(event.target.value);
    }
  }

  gameInstance.config.checkPrevious.sort((a: ICheckPrevious, b: ICheckPrevious): number => b.value - a.value);
  gameInstance.start();
}

let addButton = document.getElementById("add-button") as HTMLButtonElement;
export function addPrevious(): void {
  
  if (gameInstance.config.checkPrevious.length < 5) {
    gameInstance.config.checkPrevious.push({ value: 0, id: gameInstance.config.checkPrevious.length });
    gameInstance.config.checkPrevious.sort((a: ICheckPrevious, b: ICheckPrevious): number => b.value - a.value);
  }
  const { checkPrevious } = gameInstance.config;

  let parentEl = document.getElementById("add-previous") as HTMLElement;
  let previousInput = document.createElement('input');
  previousInput.type = 'number';
  previousInput.name = `${checkPrevious.length - 1}`;
  previousInput.id = `previous${checkPrevious.length}`;
  previousInput.min = '0';
  previousInput.max = '5';
  previousInput.value = `${gameInstance.config.checkPrevious[checkPrevious.length - 1].value}`;
  previousInput.onchange = previousInputChange;
  parentEl.append(previousInput);

  gameInstance.start();
}
addButton.onclick = addPrevious;

function speedChange(event: any): void {
  gameInstance.config.speed = event.target.value;
  gameInstance.start();
}
let speedInput = document.getElementById("speed") as HTMLInputElement;
speedInput.oninput = speedChange;
speedInput.value = '1000';

function opacityChange(event: any): void {
  gameInstance.config.opacity = event.target.value;

}
let opacityInput = document.getElementById("opacity") as HTMLInputElement;
opacityInput.oninput = opacityChange;
opacityInput.value = '0.01';