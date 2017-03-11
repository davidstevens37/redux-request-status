Redux Request Status
=============

[![npm version](https://img.shields.io/npm/v/redux-request-status.svg?style=flat-square)](https://www.npmjs.com/package/redux-request-status)
[![npm downloads](https://img.shields.io/npm/dm/redux-request-status.svg?style=flat-square)](https://www.npmjs.com/package/redux-request-status)


## Getting Started

Must use [redux-thunk](https://github.com/gaearon/redux-thunk) (or any custom middleware that provides the dispatch method to an action that is a funciton)

```js
npm install --save redux-request-status
```


## Motivation

Provide a Declarative, readable, easy to implement utility for handling asyncronous status changes. Typically, this will be an http request, but could be anything asyncronous action that returns a promise. Using `redux-request-status` we're able to respond to 3 different actions by ( `onRequest`, `onSuccess`, or `onError` ) for a single action type.


```js
// actions.js
import { asyncActionCreator } from 'redux-request-status';
import { GET_JOKE } from './constants';

function getJokeAsyncronously() {  
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ 
        joke: `A sailor in a bar leans over to the guy next to him and says, "Wanna hear a MARINE joke?" The guy next to him replies, "Well, before you tell that joke, you should know something. I'm 6'. tall, 200 lbs, and I'm a MARINE. The guy sitting next to me is 6'2" tall, weighs 225, and he's a MARINE. The fella next to him is 6'5" tall, weighs 250, and he's also a MARINE. Now, you still wanna tell that joke?"`,
        punchline: `The sailor says, "Nah, I don't want to have to explain it three times.`  
      });
    }, 2000);
  })
}

export function fetchJoke() {
  return asyncActionCreator({
    promise: getJokeAsyncronously(),
    type: GET_JOKE
  });
}
```



```js
// reducer.js
import { onSuccess, onError, onRequest } from 'redux-request-status';
import { GET_JOKE } from './constants';
import { merge } from './utilities'; // just a shortcut helper to merge state... returns Object.assign({}, ...arguments);

export default function jokeReducer(state, action) {

  switch (action.type) {

    case onRequest(GET_JOKE):
      return merge(state, { isLoading: true, isError: false });
    
    case onSuccess(GET_JOKE):
      return merge(state, {
        joke: action.data.value,
        isLoading: false,
      });

    case onError(GET_JOKE):
      return merge(state, { isError: true });

  }
}
```




## Creating Asyncronous Actions Using Promises and Thunks

the function `asyncActionCreator` will return a thunk (a function which deleys execution) for `redux-thunk` to execute.
by dispatching the actionCreator `getJoke`, `redux-response-status` will dispatch one action for when the initial action was dispatched (this is where we would typically disable the UI or display a loader), and one action when the promise resolve/rejects.

```js
import { asyncActionCreator } from 'redux-request-status';

export function getJoke() {
  return asyncActionCreator({
    promise: getJokeAsyncronously(), // `getJokeAsyncronously` must return a promise.
    type: GET_JOKE
  });
}
```



dispatching the result of `asyncActionCreator()` will dispatch 2 actions; 1 immidiatly to handle the initial request and another on resolution or rejection of the promise passed to it.
the sucess action will assign the result of the promise to the `data` key on the success action. the error action will assign the result of the rejected promise to the `error` key on the error action. All three of these actions will also contain any additional properties on the object passed to `asyncActionCreator`
 
```js

export function getJoke(jokeOptions) {
  const { category, vulgarity } = jokeOptions;
  return asyncActionCreator({
    promise: getJokeAsyncronously(category, vulgarity),
    type: GET_JOKE,
    jokeOptions
  });
}

store.dispatch(getJobs({ category: 'military', vulgarity: 2 })); 

/* 
1st -- before making request
  {
    type: 'GET_JOKE [REQUEST]',
    jokeOptions: { category: 'military', vulgarity: 2 }
  }

2nd -- after promise resolves successfully
  {
    type: 'GET_JOKE [SUCCESS]',
    jokeOptions: { category: 'military', vulgarity: 2 },
    data: { 
      joke: 'How do you tell an officer to get lost?',
      punchline: 'Give him a compass and a map.'
    }
  }  
OR -- if the promose rejects
  {
    type: 'GET_JOKE [ERROR]',
    jokeOptions: { category: 'military', vulgarity: 2 },
    error: { 
      error_type: 'NO_JOKES_AVAILABLE',
      message: 'There are no jokes that match your query'
    }
  }  
*/

```


## License

MIT