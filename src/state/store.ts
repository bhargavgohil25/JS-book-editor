import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { ActionType } from './action-types'
import { composeWithDevTools } from 'redux-devtools-extension';

// export const store = createStore(
//     reducers,
//     {},
//     applyMiddleware(thunk)
// );

const composeEnhancers = composeWithDevTools({});
 
const middlewares = [thunk];
 
export const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);

// Testing Purpose Only 

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'code'
    }
});

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'text'
    }
});
store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'code'
    }
});
store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id: null,
        type: 'text'
    }
});


// console.log(store.getState());

