const context = [];
const running = new Set();

export function createSignal(initialValue) {
    let signal = {
        value: initialValue,
        prior: initialValue,
        subscribers: new Set(),

        hook(subscriber) {
            this.subscribers.add(subscriber);
        },

        unhook(subscriber) {
            this.subscribers.delete(subscriber);
        },

        publish() {
            this.subscribers.forEach(subscriber => subscriber.react());
            for(const effect of running) {
                effect.run();
                running.delete(effect);
            }
        },
    }
  
    const proxy = new Proxy(signal, {
        get(target, prop) {
            if(prop === 'value') {
                if(context.length) {
                    target.subscribers.add(context[context.length - 1]);
                }
            }
            return Reflect.get(target, prop);
        },
        
        set(target, prop, value) {
            if (prop === 'value' && target.value !== value) {
                const lastValue = target.value;
                Reflect.set(target, 'value', value);
                Reflect.set(target, 'prior', lastValue);
                target.publish();
            }
            return true;
        },
    });

    return proxy;
}

export function createMemo(fn) {
    const memo = {
        fn,
        stale: true,
        value: fn(),
        subscribers: new Set(),

        hook(subscriber) {
            this.subscribers.add(subscriber);
        },

        unhook(subscriber) {
            this.subscribers.delete(subscriber);
        },

        publish() {
            this.subscribers.forEach(subscriber => subscriber.react());
        },

        recompute(lastValue) {
            this.value = this.fn(lastValue);
            this.stale = false;
        },

        react() {
            this.stale = true;
            this.publish();
        }
    }

    const proxy = new Proxy(memo, {
        get(target, prop) {
            if(prop === 'value') {
                if(target.stale) {
                    context.push(proxy);
                    const lastValue = target.value;
                    target.recompute(lastValue);
                    context.pop();
                }
                if(context.length) {
                    target.subscribers.add(context[context.length - 1]);
                }
            }
            return Reflect.get(target, prop);
        },
        
        set(target, prop, value) {
            return Reflect.set(target, prop, value);
        },

    });

    return proxy;
}

export function createEffect(fn) {
    const effect = {
        fn,

        run() {
            context.push(effect);
            this.fn(); 
            context.pop();
        },
        
        react() {
            running.add(this);
        },
    };

    effect.run();

    return effect;
}
