import {createPool} from 'mysql2/promise'
import { databaseKeys } from './keys.js';

const pool = createPool(databaseKeys)
export default pool;