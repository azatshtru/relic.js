import { createSignal, createEffect, createMemo } from "../signal.js";
import { forge, bind, mount } from "../anvil.js";

function Racecar(symbol, speed) {
  const distanceTravelled = createSignal(0);
  const interval = setInterval(
    () => (distanceTravelled.value += 1),
    1000 / speed,
  );
  createEffect(() => {
    if (distanceTravelled.value > 224) {
      clearInterval(interval);
    }
  });

  return forge("p").text(() => "_".repeat(distanceTravelled.value) + symbol);
}

function Racetrack() {
  const racecars = createSignal(new Map());
  const symbol = createSignal("");
  const speed = createSignal("");

  return forge("div").children([
    (o) =>
      o.mut(
        Array.from(racecars.value.entries()).map(([symbol, speed]) =>
          bind(symbol, Racecar(symbol, speed)),
        ),
      ),
    forge("input")
      .attr({ placeholder: "symbol" })
      .prop("value", () => symbol.value)
      .on("input", (e) => (symbol.value = e.target.value)),
    forge("input")
      .attr({ placeholder: "speed", type: "number" })
      .prop("value", () => +speed.value)
      .on("input", (e) => (speed.value = e.target.value)),
    forge("button")
      .on(
        "click",
        () =>
          (racecars.value = new Map(
            racecars.value.set(symbol.value, +speed.value),
          )),
      ) // TODO: make a Map helper like SolidJS
      .text("start"),
  ]);
}

mount(Racetrack(), document.body);
