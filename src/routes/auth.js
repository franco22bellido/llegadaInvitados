import express from 'express'; 
import {isLoggedIn} from '../lib/authSesion.js';

//controllers
import {renderRegister, renderLogin, authenticateRegister, authenticateLogin} from '../controllers/auth_controllers.js';




const rutasAuth = express.Router();


rutasAuth.get('/register', renderRegister);
rutasAuth.post('/register', authenticateRegister);
rutasAuth.get('/login', renderLogin);
rutasAuth.post('/login', authenticateLogin);

rutasAuth.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });




export default rutasAuth;