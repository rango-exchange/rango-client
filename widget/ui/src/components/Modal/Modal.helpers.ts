// https://github.com/reactjs/react-transition-group/blob/master/src/CSSTransition.js#L48-L55
export function forceReflow(node: HTMLElement) {
  return node.scrollTop;
}
