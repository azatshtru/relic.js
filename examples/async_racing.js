import { createSignal, createEffect, createMemo } from '../signal.js'
import { forge, bind } from '../anvil.js'

function Racecar(symbol, speed) {
    const distanceTravelled = createSignal(0);
    const interval = setInterval(() => distanceTravelled.value += 1, 1000 / speed);
    createEffect(() => {
        if(distanceTravelled.value > 224) {
            clearInterval(interval);
        }
    });

    return forge('p')
        .text(() => "_".repeat(distanceTravelled.value) + symbol)
        .build();
}

function Racetrack() {
    const racecars = createSignal(new Map());
    const symbol = createSignal('');
    const speed = createSignal('');
    
    return forge('div')
        .children([
            () => Array.from(racecars.value.entries()).map(([symbol, speed]) => bind(symbol, Racecar(symbol, speed))),
            forge('input')
                .attr({ placeholder: 'symbol' })
                .property('value', () => symbol.value)
                .on('input', e => symbol.value = e.target.value)
                .build(),
            forge('input')
                .attr({ placeholder: 'speed', type: 'number' })
                .property('value', () => +speed.value)
                .on('input', e => speed.value = e.target.value)
                .build(),
            forge('button')
                .on('click', () => racecars.value = new Map(racecars.value.set(symbol.value, +speed.value))) // TODO: make a Map helper like SolidJS
                .text('start')
                .build(),
        ])
        .build();
}

const body = document.body;
body.appendChild(Racetrack());
