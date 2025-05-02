import { createSignal, createEffect, createMemo } from "../signal.js";
import { forge } from "../compose.js";

const body = document.body;

function Counter() {
    const count = createSignal(0);
    const double = createMemo(() => count.value * 2);
    
    return forge("div")
        .children([
        forge("h1")
            .text(() => count.value)
            .build(),
        forge("h2")
            .text(() => double.value)
            .build(),
        forge("button")
            .on("click", () => count.value += 1)
            .text('+1')
            .build(),
        forge("button")
            .on("click", () => count.value -= 1)
            .text('-1')
            .build(),
        ]).build();
}

body.appendChild(Counter());
