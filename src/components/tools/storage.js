// JSON values in localStorage. both fail silently: storage can be unavailable
// (private mode, quota...), the site then keeps its in-memory state.

export function read(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // keep the in-memory state.
  }
}
