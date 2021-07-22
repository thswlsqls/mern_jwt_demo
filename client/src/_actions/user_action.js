import Axios from 'axios';

import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';

export function loginUser(dataToSubmit) {
  const request = Axios.post('/api/users/signin', dataToSubmit).then(
    (response) => response.data
  ); //요청을 보내서 서버에서 받은 응답을 저장한다.

  return {
    // 그리고 리듀서로 보낸다. 액션은 타입과 서버로부터 받은 reponse로 구성되므로 아래와 같이 반환한다.
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = Axios.post('/api/users/register', dataToSubmit).then(
    (response) => response.data
  ); //요청을 보내서 서버에서 받은 응답을 저장한다.

  return {
    // 그리고 리듀서로 보낸다. 액션은 타입과 서버로부터 받은 reponse로 구성되므로 아래와 같이 반환한다.
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  const request = Axios.get('/api/users/auth').then(
    (response) => response.data
  ); //요청을 보내서 서버에서 받은 응답을 저장한다.

  return {
    // 그리고 리듀서로 보낸다. 액션은 타입과 서버로부터 받은 reponse로 구성되므로 아래와 같이 반환한다.
    type: AUTH_USER,
    payload: request,
  };
}
