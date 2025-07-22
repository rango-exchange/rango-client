import {
  type Route,
  type RouteEvent,
  type Step,
  type StepEvent,
} from '@arlert-dev/queue-manager-rango-preset';

type NotificationRoute = {
  creationTime: number;
  from: {
    blockchain: Step['fromBlockchain'];
    symbol: Step['fromSymbol'];
    address: Step['fromSymbolAddress'];
  };
  to: {
    blockchain: Step['toBlockchain'];
    symbol: Step['toSymbol'];
    address: Step['toSymbolAddress'];
  };
};

export type Notification = Pick<Route, 'requestId'> & {
  event: RouteEvent | StepEvent;
  creationTime: number;
  route: NotificationRoute;
};
