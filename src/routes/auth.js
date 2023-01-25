import express from 'express'; 
import {isLoggedIn, isNotLoggedin} from '../lib/authSesion.js';
import pool from  '../database.js';

//controllers
import {renderRegister, renderLogin, authenticateRegister, authenticateLogin} from '../controllers/auth_controllers.js';




const rutasAuth = express.Router();


rutasAuth.get('/register',[isNotLoggedin], renderRegister);
rutasAuth.post('/register',[isNotLoggedin], authenticateRegister);
rutasAuth.get('/login',[isNotLoggedin], renderLogin);
rutasAuth.post('/login',[isNotLoggedin], authenticateLogin);
rutasAuth.get('/prueba', async(req, res)=>{
    try {
      const [result] = await pool.query('select 1 + 1');
      const franco = result;
      console.log(franco);
      console.log("holamundo");
      res.status(200).json('holamundo');
    } catch (error) {
      console.log(error.message);
    }
});

rutasAuth.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });




export default rutasAuth;