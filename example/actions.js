// actions.js
import { asyncActionCreator } from 'redux-request-status';
import { CHUCK_NORRIS_JOKE, MARK_AS_FAVORITE } from './constants';


function fetchChuckNorrisJoke() {
  return fetch('https://api.chucknorris.io/jokes/random').then(res => res.json());
}

export function fetchJoke() {
  return asyncActionCreator({
    promise: fetchChuckNorrisJoke(),
    type: CHUCK_NORRIS_JOKE
  })
}

export function markAsFavorite() {
  return { type: MARK_AS_FAVORITE };
}