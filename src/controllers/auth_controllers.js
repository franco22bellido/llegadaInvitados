import passport from 'passport';
import helpers from '../lib/helpers.js';
import conecction from '../database.js';

export const renderRegister = (req ,res)=>{
    res.render('./auth/register');
}

export const authenticateRegister =  async(req, res)=>{
        try {
            const {username, password} = req.body;

            const passEncrip = await helpers.encriptar(password);
            let newUser = {
                nombre_usuario: username,
                contraseña: passEncrip
            }
            const result = await conecction.query(`insert into usuarios set ?`, [newUser] );
            res.redirect('/login');

        } catch (error) {
            res.json(error.message);    
        }
};

export const renderLogin = (req, res)=>{
    res.render('auth/login');
}

export const authenticateLogin = async (req, res, next)=>{
    passport.authenticate('local.login',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}