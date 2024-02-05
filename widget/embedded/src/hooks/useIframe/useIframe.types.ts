type Message<T, D> = {
  type: T;
  data: D;
};
type WidgetHeightMessage = Message<
  'widget_height',
  {
    height: number;
  }
>;

// Add new types of messages to this union.
export type Messages = WidgetHeightMessage;
