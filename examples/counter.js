import { createSignal, createEffect, createMemo } from "../signal.js";
import { forge, mount } from "../anvil.js";

const body = document.body;

function Counter() {
    const count = createSignal(0);
    const double = createMemo(() => count.value * 2);
    
    return forge("div")
        .children([
        forge("h1")
            .text(() => count.value),
        forge("button")
            .on("click", () => count.value += 1)
            .text('+1'),
        forge("button")
            .on("click", () => count.value -= 1)
            .text('-1'),
        forge("h2")
            .text(() => double.value),
        ]);
}

mount(Counter(), body);
