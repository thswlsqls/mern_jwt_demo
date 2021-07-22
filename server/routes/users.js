require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
// const { auth } = require('./middleware/auth'); //미들웨어 역할을 하는 모듈을 직접 만들어 임포트한다.
const { User } = require('../models/User');

router.post('/signup', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);
  console.log(req.body);
  user.save((err, userInfo) => {
    //mongoose의 메서드이다.
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post('/signin', (req, res) => {
  console.log(req.body);

  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log('user : ', user);
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        //만약 비밀번호가 맞지 않다면,
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      // 비밀번호까지 맞다면 토큰을 생성하기.
      const tokens = generateToken(user);
      //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 여러가지 방법이 있고 각각 장단점이 존재한다.
      res
        .cookie('accessToken', tokens.accessToken) //첫번째 인자로 쿠키의 이름, 두번째 인자로 쿠키의 값이 전달된다.
        .cookie('refreshToken', tokens.refreshToken) //{maxAge: 1000*60*60*24*14} 2주 후에 만료되는 쿠키를 발급한다
        .status(200)
        .json({
          loginSuccess: true,
          userId: user._id,
          tokens: tokens,
          user: user,
        });
    });
  });
});

const generateToken = (user) => {
  //jsonwebtoken을 이용해서 token을 생성하기

  const accessTokenPayload = {
    iss: 'eunbin',
    sub: 'userAccessToken',
    jti: user._id.toString(),
    aud: user._id.toString(),
    'http://localhost': true,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    token_type: 'access',
  };

  const refreshTokenPayload = {
    iss: 'eunbin',
    sub: 'userRefreshToken',
    jti: user._id.toString(),
    aud: user._id.toString(),
    'http://localhost': true,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    token_type: 'refresh',
  };

  const accessToken = jwt.sign(
    accessTokenPayload,
    '0252f303ca26822500d0601b86a9cc6f35d705820b566696f21ca913f7a8818028cf94484b2aeb4de24d0ab85ea773c4c18991c8ba79bc23040f1ce70bbc9945',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    '211a607a053438befb04e266ad4e687e3913aa22bdf66a0c3217f56263be84fa04b66832eca8d2a0d9a379502299151af9e6635805b954f1a45d1fe0ede80062',
    { expiresIn: '30s' }
  );

  return { accessToken: accessToken, refreshToken: refreshToken };
};

//   // ex) role 1 어드민 role 2 특정 부서 어드민 ...
//   // 이 경우에는, role 0 -> 일반유저 role 0이 아니면 관리자
//   app.get('/api/users/auth', auth, (req, res) => {
//     //여기까지 미들웨어를 통과해 왔다는 이야기는 Authentication이 true라는 말이다.
//     res.status(200).json({
//       _id: req.user._id, //auth미들웨어에서 user정보를 req.user에 저장하였기 때문에 이와 같이 _id값을 가져올 수 있다.
//       isAdmin: req.user.role === 0 ? false : true,
//       //role 0 -> 일반유저 role 0이 아니면 관리자이다.
//       isAuth: true,
//       email: req.user.email,
//       name: req.user.name,
//       lastname: req.user.lastname,
//       role: req.user.role,
//       image: req.user.image,
//     });
//   });

// router.get('/api/users/logout', auth, (req, res) => {
//   User.findOneAndUpdate({ _id: req.user._id }, (err, user) => {
//     if (err) return res.json({ success: false, err }); //에러가 발생하면,
//     return res
//       .status(200)
//       .clearCookie('tokens')
//       .clearCookie('loginCookie')
//       .clearCookie('accessToken')
//       .clearCookie('refreshToken')
//       .send({
//         // 에러가 발생하지 않는다면,
//         success: true,
//       });
//   });
// });

router.get('/logout', (req, res) => {
  User.find((err, users) => {
    if (err) return res.json({ success: false, err }); //에러가 발생하면,
    return res
      .status(200)
      .clearCookie('loginCookie')
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .send({
        // 에러가 발생하지 않는다면,
        success: true,
      });
  });
});

router.post('/generateToken', (req, res) => {
  const user = req.body;
  //jsonwebtoken을 이용해서 token을 생성하기

  const accessTokenPayload = {
    iss: 'eunbin',
    sub: 'userAccessToken',
    jti: user._id.toString(),
    aud: user._id.toString(),
    'http://localhost': true,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    token_type: 'access',
  };

  const refreshTokenPayload = {
    iss: 'eunbin',
    sub: 'userRefreshToken',
    jti: user._id.toString(),
    aud: user._id.toString(),
    'http://localhost': true,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    token_type: 'refresh',
  };

  const accessToken = jwt.sign(
    accessTokenPayload,
    '0252f303ca26822500d0601b86a9cc6f35d705820b566696f21ca913f7a8818028cf94484b2aeb4de24d0ab85ea773c4c18991c8ba79bc23040f1ce70bbc9945',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    '211a607a053438befb04e266ad4e687e3913aa22bdf66a0c3217f56263be84fa04b66832eca8d2a0d9a379502299151af9e6635805b954f1a45d1fe0ede80062',
    { expiresIn: '30s' }
  );

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

router.get('/authToken', (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // console.log(req.body);
  console.log(accessToken);
  console.log(refreshToken);

  // user.save((err, userInfo) => {
  //   //mongoose의 메서드이다.
  //   if (err) return res.json({ success: false, err });
  //   return res.status(200).json({
  //     success: true,
  //   });
  // });
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

module.exports = router;
