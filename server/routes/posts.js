require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const posts = [
  {
    title: 'post01',
    content: 'content01',
  },
  {
    title: 'post02',
    content: 'content02',
  },
  {
    title: 'post03',
    content: 'content03',
  },
];

const authTokens = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split('  ')[1];
  if (token == null) return res.send(401);

  jwt.verify(
    token,
    '0252f303ca26822500d0601b86a9cc6f35d705820b566696f21ca913f7a8818028cf94484b2aeb4de24d0ab85ea773c4c18991c8ba79bc23040f1ce70bbc9945',
    (err, decoded) => {
      if (err) return res.send(403);
      next();
    }
  );
};

router.get('/getPosts', authTokens, (req, res) => {
  res.json(posts);
});

router.post('/generateToken', (req, res) => {
  const user = req.body;
  const accessTokenPayload = {
    iss: 'eunbin',
    sub: 'userAccessToken',
    jti: user._id,
    'http://localhost': true,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    token_type: 'access',
  };

  const refreshTokenPayload = {
    iss: 'eunbin',
    sub: 'userRefreshToken',
    jti: user._id,
    'http://localhost': true,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    token_type: 'refresh',
  };

  const accessToken = jwt.sign(
    accessTokenPayload,
    '0252f303ca26822500d0601b86a9cc6f35d705820b566696f21ca913f7a8818028cf94484b2aeb4de24d0ab85ea773c4c18991c8ba79bc23040f1ce70bbc9945',
    { expiresIn: '15s' }
  );

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    '211a607a053438befb04e266ad4e687e3913aa22bdf66a0c3217f56263be84fa04b66832eca8d2a0d9a379502299151af9e6635805b954f1a45d1fe0ede80062',
    { expiresIn: '30s' }
  );

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

module.exports = router;
