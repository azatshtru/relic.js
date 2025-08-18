import { createSignal, createEffect, createMemo } from "../signal.js";
import { forge, bind } from "../anvil.js";

function SpellcastHistory() {
    const spellThreshold = 5;
    const history = createSignal([]);    
    const style = createMemo(() => history.value.length > spellThreshold ? 
        { background: 'black', color: 'white' } : { background: 'white', color: 'black' });

    const castSpell = (spell) => history.value = [...history.value, spell];

    return forge("div")
        .children([
            Spellcast(castSpell),
            () => history.value.length > spellThreshold ? forge("h2").text('You have cast too much spells young wizard').build() : '',
            () => history.value.map(x => forge("p").text(x).build()),
            forge('button').text('forget spellcast history').on('click', () => history.value = []).build(),
        ])
        .style({
            background: () => style.value.background,
            color: () => style.value.color,
        })
        .class([
            'foo', 'bar',
            bind('baz', () => history.value.length > spellThreshold),
        ])
        .build();
}

function Spellcast(castSpell) {
    const spell = createSignal("");
    
    return forge("div")
        .children([
        forge("input")
            .property('value', () => spell.value)
            .attr({
                placeholder: 'cast spell',
            })
            .on("keydown", e => {
                if(e.key == "Enter") {
                    castSpell(spell.value);
                    spell.value = "";
                }
            })
            .on("input", e => spell.value = e.target.value)
            .build(),
        ]).build();
}

const body = document.body;
body.appendChild(SpellcastHistory());
