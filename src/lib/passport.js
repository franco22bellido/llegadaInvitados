import passport from "passport";
import localStrategy from 'passport-local';
import conecction from '../database.js';
import helpers from "./helpers.js";

passport.use('local.login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
  
    try {
        const result = await conecction.query(`select * from usuarios where nombre_usuario =?`,[username]);
        if(result.length < 1) throw new Error('usuario no encontrado');
        const user = result[0];

        //comparar contraseñas
        const validarPass = await helpers.comparePass(password, user.contraseña);
        console.log(validarPass);
        if(!validarPass) throw new Error('la contraseña es incorrecta');
        done(null, user);

    } catch (error) {
        return done(null, false, req.flash('message',error.message));
        
    }

}));



passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
    const result = await conecction.query('SELECT * FROM usuarios where id = ? ',[id]);
    done(null, result[0]);
});

    
export default passport;