import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import promiseMiddleware from 'redux-promise'; //스토어에서 프로미스 형태의 액션을 받을 때 사용한다. 디스패치에게 프로미스 형태의 데이터가 왔을 때 대처하는 방법을 알려준다.
import ReduxThunk from 'redux-thunk'; //스토어에서 펑션 형태의 액션을 받을 때 사용한다. 디스패치에게 펑션 형태의 데이터가 왔을 대 대처하는 방법을 알려준다.
import { applyMiddleware, createStore } from 'redux';
import Reducer from './_reducers';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore) 

ReactDOM.render(
  <Provider
      store={createStoreWithMiddleware(Reducer,
          window.__REDUX_DEVTOOLS_EXTENSION__&&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  > 
      <App />
  </Provider>,
  document.getElementById('root') //root에 해당하는 엘레멘트의 구역에 첫번째 인자로 넘겨준 컴포넌트를 렌더링한다.
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

