require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //생성할 salt의 글자수를 설정한다.
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
});

userSchema.pre('save', function (next) {
  //유저스키마에 정보를 저장하기 전에 함수를 수행한다.
  var user = this;
  if (user.isModified('password')) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      }); //에러가 나면 다음 미들웨어로 보내고, salt를 제대로 생성하면 비밀번호 암호화를 진행한다.
    });
  } else {
    //비밀번호를 제외한 사용자 정보를 변경한 경우에는 바로 다음 미들웨어로 넘어간다.
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 123456789012  암호화된 비밀번호
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    //입략값과 db에 저장된 값을 비교하여 콜백함수를 호출한다.
    if (err) return cb(err); //에러가 발생한다면,
    cb(null, isMatch); //에러가 없다면, 비밀번호가 같다는 true값을 반환한다.(isMatch는 불린값을 반환한다.)
  });
};

userSchema.methods.generateToken = function () {
  const user = this;

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
    { expiresIn: '14d' }
  );
};

// userSchema.statics.findByToken = function (token, cb) {
//   var user = this;

//   //토큰을 decode한다.
//   jwt.verify(token, 'secretToken', function (err, decoded) {
//     //첫번째 인자로 전달된 토큰 정보에서 두번째 정보로 전달된 부분을 제외한 부분, 즉 user._id부분이 디코드되어 콜백함수의 인자로 전달된다.
//     // 유저 아이디를 이용해서 유저를 찾은 다음에
//     // 클라이언트에서 가져운 token과 DB에 보관된 토큰이 일치하는지 확인

//     user.findOne({ _id: decoded, token: token }, function (err, user) {
//       if (err) return cb(err); //에러가 있다면 에러정보를
//       cb(null, user); //에러가 없다면 유저정보를 콜백함수의 인자로 전달한다.
//     });
//   });
// };

const User = mongoose.model('User', userSchema); //스키마를 모델로 감싸준다. 첫번째 인자는 모델의 이름, 두번째 인자는 스키마이다.

module.exports = { User }; // 생성한 모델을 다른 파일에서도 사용할 수 있게 한다.
