import mysql from 'mysql';
import {databaseKeys} from './keys.js';
import { promisify } from 'util';

const conecction = mysql.createPool(databaseKeys);

conecction.getConnection((err, conecction)=>{
    try {
      if(err)  throw new Error('error al conectar a la db');
      if(conecction) console.log('conexión éxitosa');

    } catch (error) {
        
    } 
});
//convierte callbacks en promesas
conecction.query = promisify(conecction.query);

export default conecction;