const callbacks = [];
let pending = false;
let timerFunc: Function;

if (typeof Promise !== 'undefined') {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== 'undefined' && MutationObserver.toString() === '[object MutationObserverConstructor]') {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (const func of copies) {
    func();
  }
}

export function nextTick(cb: Function, ctx: Object, ...args: any[]) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx, ...args);
      } catch (e) {
        console.error(e);
      }
    } else if (_resolve) {
      _resolve(args);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  if (!cb && typeof Promise !== 'undefined') {
    new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
