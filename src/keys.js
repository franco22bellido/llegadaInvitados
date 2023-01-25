export const databaseKeys = {
    host: process.env.HOST || 'us-east.connect.psdb.cloud',
    user: process.env.USER || 'q5eeh6zxow6sq1dvbeq6',
    password: process.env.PASSWORD ||'pscale_pw_lD5R9gPar1TAZVW2dpROgiMTPrvAWS6hQLtLsxfVfjJ',
    database: process.env.DATABASE || 'invitados_db',
    port: process.env.port || 3306,
    ssl: {
        rejectUnauthorized: false
    }
};