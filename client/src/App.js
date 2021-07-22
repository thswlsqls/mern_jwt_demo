import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import Registerpage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';

import Axios from 'axios';

import navAppBar from './components/views/navAppBar/navAppBar';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App(props) {
  const classes = useStyles();

  const logoutHandler = () => {
    Axios.get('/api/users/logout').then((response) => {
      if (response.data.logoutSuccess) {
        props.history.push('/signin');
        alert('성공적으로 로그아웃 했습니다.');
      } else {
        alert('로그아웃을 실패하였습니다. 혹은 이미 로그아웃한 상태입니다.');
      }
    });
  };

  return (
    <div style={{ height: '100%' }}>
      <Router>
        <navAppBar />
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                <a href="/" style={{ color: 'white' }}>
                  HOME
                </a>
              </Typography>
              <Button href="/signIn" color="inherit">
                Sign in
              </Button>
              <Button href="/signUp" color="inherit">
                Sign up
              </Button>
              <Button onClick={() => logoutHandler()} color="inherit">
                Sign out
              </Button>
            </Toolbar>
          </AppBar>
        </div>
      </Router>
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Router>
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/signIn" component={Auth(LoginPage, false)} />
            <Route exact path="/signUp" component={Auth(Registerpage, false)} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
