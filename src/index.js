const REQUEST = '[REQUEST]';
const SUCCESS = '[SUCCESS]';
const ERROR = '[ERROR]';

const actionTypeCreator = status => type => {
  return `${type} ${status}`;
}

export function onRequest(type) {
  return actionTypeCreator(REQUEST)(type);
}
export function onError(type) {
  return actionTypeCreator(ERROR)(type);
}
export function onSuccess(type) {
  return actionTypeCreator(SUCCESS)(type);
}

export function asyncActionCreator({ type, promise, ...rest }) {

  return (dispatch, getState) => {

    dispatch({ type: onRequest(type), ...rest });

    return promise.then(data => dispatch({ type: onSuccess(type) , data, ...rest }))
      .catch(error => dispatch({ type: onError(type), error, ...rest }));
      
  }
}


export const promiseMiddleware = ({ dispatch }) => next => action => {

  const { type, promise, ...rest} = action;    

  const isPromise = typeof (promise || {}).then === 'function'

  if (!isPromise) return next(action);
  
  dispatch({ type: onRequest(type), ...rest });

  return promise
    .then(data => next({ type: onSuccess(type), data, extra: rest }))
    .catch(error => next({ type: onError(type), error, ...rest }));
  
}


export default {
  onRequest,
  onError,
  onSuccess,
  asyncActionCreator,
  promiseMiddleware
}
