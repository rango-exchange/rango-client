export function idGenerator() {
  let id = 1;
  return () => {
    id++;
    return id;
  };
}
