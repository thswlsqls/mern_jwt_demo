import React, { useEffect } from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';

function LandingPage(props) {
  useEffect(() => {
    Axios.get('/api/hello').then((response) => console.log(response.data));
  }, []); //cors정책에 의해 보안적인 이유로 서로 다른 포트를 갖고 있는 서버는 req를 보낼 수 없다.
  //cross origin request sharing의 약자이다. 서버와 클라이어에서 별도의 설정을 해주는 것으로 해결할 수도 있지만 proxy를 사용할 수도 있다.

  const onClickHandler = () => {
    Axios.get('/api/users/logout').then((response) => {
      if (response.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃 하는데 실패 했습니다.');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <DeveloperModeIcon
        style={{
          width: '360px',
          height: '720px',
          margin: '0px',
          color: 'rgba(63, 81, 101, 1)',
        }}
      />
      {/* <button onClick={onClickHandler}>logout</button> */}
    </div>
  );
}

export default withRouter(LandingPage);
