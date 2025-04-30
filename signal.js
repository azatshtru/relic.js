const signal = {
  _value: null,
  subscribers: null,
  
  subscribe(funcy) {
    this.subscribers.add(funcy);
    return () => this.subscribers.delete(funcy);
  },
  
  notify() {
    this.subscribers.forEach(funcy => funcy(this._value));
  },
};

let runningEffect = null;

function createSignal(firstTime) {
  let newSignal = Object.create(signal);
  newSignal._value = firstTime;
  newSignal.subscribers = new Set();
  
  const proxy = new Proxy(newSignal, {
    get(target, prop) {
      if (runningEffect) {
        target.subscribers.add(runningEffect);
      }
      return target._value;
    },
    
    set(target, prop, newValue) {

      if (target._value !== newValue) {
        target._value = newValue;
        target.notify();
      }
      return true;
    }
  });
  
  return proxy;
}

function createEffect(funcy) {
  const newEffect = () => {
    runningEffect = newEffect;
    funcy();
    runningEffect = null;
 
  };
  newEffect();
  return newEffect;
}

const count = createSignal(0);

createEffect(() => {
  console.log(count.value);
});
count.value = 10;
count.value = 20;
