
import { onSuccess, onError, onRequest } from 'redux-request-status';
import { CHUCK_NORRIS_JOKE, MARK_AS_FAVORITE } from './constants';

const defaultState = {
  isError: false,
  isLoading: false,
  favorite: '',
  joke: ''
}

export default function chuckNorrisJokeReducer(state = defaultState, action) {

  switch (action.type) {

    case onRequest(CHUCK_NORRIS_JOKE):
      return merge(state, { isLoading: true, isError: false });

    case onSuccess(CHUCK_NORRIS_JOKE):
      return merge(state, {
        joke: action.data.value,
        isLoading: false,
      });

    case onError(CHUCK_NORRIS_JOKE):
      return merge(state, { isError: true });

    case MARK_AS_FAVORITE:    
      return merge(state, { favorite: state.joke });

    default:
      return state;
      
  }

}


function merge(){
  return Object.assign({}, ...arguments);
} 