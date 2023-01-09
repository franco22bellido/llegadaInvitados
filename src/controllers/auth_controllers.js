import passport from 'passport';

export const renderRegister = (req ,res)=>{
    res.render('./auth/register');
}

export const authenticateRegister =  async(req, res)=>{

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