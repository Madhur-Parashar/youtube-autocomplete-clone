export default function debounce(fn, delay) {
  let timer;
  return function (...args) {
    console.log(timer);
    if (timer) {
      clearTimeout(timer);
    }
    console.log("reaching in set")
    timer = setTimeout(() => {
      console.log("called");
      fn(...args);
      timer = null;
    }, delay);
  };
}
