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
            this.element.replaceChildren();
            for(const child of children) {
                if(typeof child === 'function') {
                    const reactiveElement = document.createElement('div');
                    reactiveElement.style.all = 'unset';
                    createEffect(() => reactiveElement.replaceChildren(...Array.isArray(child()) ? child() : [child()]));
                    this.element.append(reactiveElement);
                } else {
                    this.element.append(child);
                }
            }
            return this;
        },

        attr(attributes) {
            for(const [key, value] of Object.entries(attributes)) {
                if(typeof value === 'function') {
                    createEffect(() => this.element.setAttribute(key, value()));
                } else {
                    this.element.setAttribute(key, value);
                }
            }
            return this;
        },

        property(key, value) {
            if(typeof value === 'function') {
                createEffect(() => this.element[key] = value());
            } else {
                this.element[key] = value;
            }
            return this;
        },

        style(style) {
            if(typeof style === 'function') {
                createEffect(() => {
                    this.element.removeAttribute('style');
                    Object.assign(this.element.style, style());
                });
            } else {
                Object.assign(this.element.style, style);
            }
            return this;
        },
    };
}

const cast = {
}
