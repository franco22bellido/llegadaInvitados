import pool from '../database.js';
import jwt from 'jsonwebtoken';
import {toString} from 'qrcode';



export const ver_invitados = async (req, res) => {
    try {
        const invitados = await pool.query(`
        select i.id, i.apellido,i.mesa, nombre_estado, hora_llegada from invitados i
        left join estados e on i.verificado = e.id
        where id_usuario =?`,[req.user.id]);

        res.render('invitados/ver_invitados', { invitados });

    } catch (error) {
        req.flash('message', error.message);
        req.redirect('/');

    }
}


export const verificarInvitado = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) throw new Error("campo id vacio");


        const verificar = pool.query(`
        update invitados set verificado = true,
        token = null,
        hora_llegada = current_timestamp()
        where id =? and id_usuario =?`,[id, req.user.id]);


        res.redirect('/');

    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/');
    }
}


export const verificarinvitadoToken = async(req, res)=>{
    
    try {
        const {token} = req.params;
        
        const {id_invitado, id_usuario} = jwt.verify(token, req.user.contraseña);
        
        if(id_usuario != req.user.id) throw new Error('no te pertence ese invitado')
        
        await pool.query(`
        update invitados set verificado = true,
        token = null,
        hora_llegada = current_timestamp()
        where id =? and id_usuario =?`,[id_invitado, id_usuario]);
        

        req.flash('message', 'se verificó satisfactoriamente');
        res.redirect('/');
    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/');
    }

}



export const renderCrearInvitado = async(req, res)=>{
    res.render('invitados/crear_invitado');
}


export const crearInvitado = async (req, res) => {
    try {
        const { apellido, mesa } = req.body;
        let id_usuario = req.user.id;

        let newInvitado = {
            apellido,
            mesa,
            id_usuario
        }
        
        const result = await pool.query('insert into invitados set ?',[newInvitado]);
        
        const token = jwt.sign({ id_usuario, id_invitado: result.insertId}, req.user.contraseña);

        const updateResult = await pool.query(`
        update invitados set
        token =?
        where id=?`,[token, result.insertId]);



        const url = 'http://localhost:4000/verificarInvitado/'+ token;

        toString(url, {type: 'svg'},(err, data)=>{
            if(err) return;
            
            let position = data.indexOf(`d="M4`) + 3;
            let positionEnd = data.indexOf(`"/></svg>`);
            let qrElement = `${data.substring(position,positionEnd)}`;

            
            res.render('invitados/crear_invitado', {qrElement});
        });


    } catch (error) {
        console.log(error.message);
        req.flash('message', error.message);
        res.redirect('/');
    }

}