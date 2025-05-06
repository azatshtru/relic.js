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
            for(const [key, value] of Object.entries(style)) {
                if(typeof value === 'function') {
                    createEffect(() => this.element.style[key] = value() ?? '');
                } else {
                    this.element.style[key] = value ?? '';
                }
            }
            return this;
        },

        class(classList) {
            for(const token of classList) {
                if(Array.isArray(token)) {
                    createEffect(() => {
                        const [className, toggle] = token;
                        this.element.classList.toggle(className, toggle());
                    });
                } else {
                    this.element.classList.add(token);
                }
            }
            return this;
        },
    };
}

export const cast = {
}

export function bind(...args) {
    return args;
}
