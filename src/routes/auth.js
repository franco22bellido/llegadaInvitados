import express from 'express'; 
import {isLoggedIn, isNotLoggedin} from '../lib/authSesion.js';

//controllers
import {renderRegister, renderLogin, authenticateRegister, authenticateLogin} from '../controllers/auth_controllers.js';




const rutasAuth = express.Router();


rutasAuth.get('/register',[isNotLoggedin], renderRegister);
rutasAuth.post('/register',[isNotLoggedin], authenticateRegister);
rutasAuth.get('/login',[isNotLoggedin], renderLogin);
rutasAuth.post('/login',[isNotLoggedin], authenticateLogin);

rutasAuth.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });




export default rutasAuth;