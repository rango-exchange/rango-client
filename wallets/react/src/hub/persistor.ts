export interface PersistStorage<T> {
  getItem: (name: string) => T | null;
  setItem: (name: string, value: T) => void;
  removeItem: (name: string) => void;
}

export class Persistor<T> implements PersistStorage<T> {
  getItem(name: string) {
    const item = localStorage.getItem(name);
    const parsedItem = item ? (JSON.parse(item) as T) : null;
    return parsedItem;
  }
  setItem(name: string, value: T) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  removeItem(name: string) {
    localStorage.removeItem(name);
  }
}
