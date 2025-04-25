function createSignal(value) {

  const target = new Proxy(target, {

    set() {
      this.target = value;
      return 1;
    },

    get() {
      console.log(this.target)
      return this.target;
    },
    
  })

}

// function createEffect(func, dependants) {
//
// }
//

const something = createSignal(0)


