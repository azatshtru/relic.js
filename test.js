import { createSignal, createEffect, createMemo } from "./signal.js"

const count = createSignal(0);
createEffect(lastValue => console.log(count.value + " was " + lastValue));
const double = createMemo(() => count.value * 2);
createEffect(() => console.log("double: " + double.value));

count.value = 5;
count.value = 7;


