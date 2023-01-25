import pool from '../database.js';
import jwt from 'jsonwebtoken';
import { toString } from 'qrcode';
import createQr from '../lib/createQr.js';


export const ver_invitados = async (req, res) => {
    try {
        console.log("se redirije");        
        const [rows] = await pool.query(`
        select i.id, i.apellido,i.mesa, nombre_estado, hora_llegada from invitados i
        left join estados e on i.verificado = e.id
        where id_usuario =?`, [req.user.id]);
        const invitados = rows
        
        res.render('invitados/ver_invitados',  {invitados} );

    } catch (error) {
        req.flash('message', error.message);
        res.json({
            error: error.message
        });

    }
}


export const verificarInvitado = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) throw new Error("campo id vacio");
        

        const verificar =await  pool.query(`
        update invitados set verificado = true,
        hora_llegada = current_timestamp()
        where id =? and id_usuario =?`, [id, req.user.id]);


        res.redirect('/');

    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/');
    }
}


export const verificarinvitadoToken = async (req, res) => {

    try {
        const { token } = req.params;

        const { id_invitado, id_usuario } = jwt.verify(token, req.user.password);

        if (id_usuario != req.user.id) throw new Error('no te pertence ese invitado')

        await pool.query(`
        update invitados set verificado = true,
        hora_llegada = current_timestamp()
        where id =? and id_usuario =?`, [id_invitado, id_usuario]);


        req.flash('message', 'se verificó satisfactoriamente');
        res.redirect('/');
    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/');
    }

}



export const renderCrearInvitado = async (req, res) => {
    res.render('invitados/crear_invitado');
}


export const crearInvitado = async (req, res) => {
    try {
        const { apellido, mesa } = req.body;
        let id_usuario = req.user.id;
        if(!apellido || !mesa) throw new Error('campos vacios');


        let newInvitado = {
            apellido,
            mesa,
            id_usuario
        }

        const [result] = await pool.query('insert into invitados set ?', [newInvitado]);
        
        const  token = jwt.sign({ id_usuario, id_invitado: result.insertId }, req.user.password);

        /**
         * el token lo guardo de nuevo para poder verlo en la tabla principal con su qr
         * aunque creo que seria mejor no guardarlo y generar un token cada vez que se guiera 
         * ver la invitación?
         */
        const updateResult = await pool.query(`
        update invitados set
        token =?
        where id=?`, [token, result.insertId]);


        const url = `http://${req.headers.host}/verificarInvitado/${token}`;

        const qrElement = await createQr(url);
        
        res.render('invitados/crear_invitado', { qrElement });


    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/crearinvitado');
    }
}




export const eliminarInvitado = async (req, res) => {
    try {
        const { id } = req.body;
        let id_usuario = req.user.id;
        if(!id) throw new Error('campo vacio');
        const [result] =await pool.query(`delete from invitados where id = ? and id_usuario = ?`, [id, id_usuario]);
        
        if(result.affectedRows== 0) throw new Error('invitado no encontrado');
        res.redirect('/');
    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/');
    }
} 


export const verInvitacion = async (req, res) => {
    try {
        const { id } = req.query
        if(!id) throw new Error('campo vacio');
        const id_usuario = req.user.id;
       
        const [rows] = await pool.query(`select * from invitados where id =? and id_usuario =?`,[id,id_usuario]);
        
        if(!rows[0].token) throw new Error('token no encontrado');

        const token = rows[0].token;
        
        const url = `http://${req.headers.host}/verificarInvitado/${token}`;
        const qrElement = await createQr(url);
     
        res.render('invitados/crear_invitado', { qrElement });


    } catch (error) {
        req.flash('message', error.message);
        res.redirect('/');
    }
}