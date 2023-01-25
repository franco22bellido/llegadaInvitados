import {createPool} from 'mysql2/promise'
import { databaseKeys } from './keys.js';

const newConection = await createPool(databaseKeys).getConnection()
.then((conecction)=>{
    console.log("conectado")
    return conecction
}).catch((err)=>{
    return console.log(err)
});



export default newConection;