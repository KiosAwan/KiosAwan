import { createLogger } from 'redux-logger';

const middlewares = [];

if (__DEV__) {
  middlewares.push(createLogger());
}

export default middlewares;