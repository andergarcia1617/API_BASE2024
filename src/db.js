import mysql from 'mysql2/promise';  // Importa el paquete completo
const { createPool } = mysql;        // Extrae createPool del paquete
import { BD_HOST, DB_USER, DB_PASSWORD, BD_DATABASE, DB_PORT } from './config.js';

export const conmysql = createPool({
    host: BD_HOST,
    database: BD_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT
});