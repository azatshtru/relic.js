import { createEffect } from "./signal.js";

export function forge(htmlTag) {
    return {
        element: document.createElement(htmlTag),
        
        text(s) {
            if(typeof s === 'function') {
                createEffect(() => this.element.textContent = s());
            } else {
                this.element.textContent = s;
            }
            return this;
        },

        on(event, fn) {
            this.element.addEventListener(event, fn);
            return this;
        },

        build() {
            return this.element;
        },

        children(children) {
            createEffect(() => {
                this.element.replaceChildren();
                this.element.append(...children);
            });
            return this;
        }
    };
}
