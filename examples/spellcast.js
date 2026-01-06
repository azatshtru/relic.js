import { createSignal, createEffect, createMemo } from "../signal.js";
import { forge, bind, mount } from "../anvil.js";

function SpellcastHistory() {
  const spellThreshold = 5;
  const history = createSignal([]);
  const style = createMemo(() =>
    history.value.length > spellThreshold
      ? { background: "black", color: "white" }
      : { background: "white", color: "black" },
  );

  const castSpell = (spell) => (history.value = [...history.value, spell]);

  return forge("div")
    .children([
      Spellcast(castSpell),
      (o) =>
        o.mut(
          history.value.length > spellThreshold
            ? forge("h2")
                .text("You have cast too much spells young wizard")
            : document.createTextNode(""),
        ),
      (o) => o.mut(history.value.map((x) => forge("p").text(x))),
      forge("button")
        .text("forget spellcast history")
        .on("click", () => (history.value = []))
    ])
    .style({
      background: () => style.value.background,
      color: () => style.value.color,
    })
    .class([
      "foo",
      "bar",
      bind("baz", () => history.value.length > spellThreshold),
    ]);
}

function Spellcast(castSpell) {
  const spell = createSignal("");

  return forge("div")
    .children([
      forge("input")
        .prop("value", () => spell.value)
        .attr({
          placeholder: "cast spell",
        })
        .on("keydown", (e) => {
          if (e.key == "Enter") {
            castSpell(spell.value);
            spell.value = "";
          }
        })
        .on("input", (e) => (spell.value = e.target.value))
    ])
}

mount(SpellcastHistory(), document.body);
