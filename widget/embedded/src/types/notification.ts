import {
  type Route,
  type RouteEvent,
  type Step,
  type StepEvent,
} from '@rango-dev/queue-manager-rango-preset';

type NotificationRoute = {
  from: {
    blockchain: Step['fromBlockchain'];
    tokenSymbol: Step['fromSymbol'];
    tokenAddress: Step['fromSymbolAddress'];
  };
  to: {
    blockchain: Step['toBlockchain'];
    tokenSymbol: Step['toSymbol'];
    tokenAddress: Step['toSymbolAddress'];
  };
};

export type Notification = Pick<Route, 'requestId'> & {
  event: RouteEvent | StepEvent;
  creationTime: number;
  read: boolean;
  route: NotificationRoute;
};
