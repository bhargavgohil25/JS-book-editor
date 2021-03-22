import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
//! import { composeWithDevTools } from "redux-devtools-extension";
import { persistMiddleware } from './middlewares/persist-middleware'


// const composeEnhancers = composeWithDevTools({});

// // const middlewares = [thunk];

// export const store = createStore(
//   reducers,
//   {},
//   composeEnhancers(applyMiddleware(persistMiddleware,thunk))
// );

// Testing Purpose Only



// console.log(store.getState());


export const store = createStore(
  reducers,
  {},
  applyMiddleware(persistMiddleware, thunk)
);