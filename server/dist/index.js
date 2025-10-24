import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from 'pg';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import otprouters from './OtpRouter.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});
try {
    app.use('/otp', otprouters);
    app.post('/ifexist', async (req, res) => {
        const mail_id = req.body.mailid;
        try {
            await pool.query(`SELECT mail_id FROM users WHERE mail_id=$1;`, [mail_id]);
            res.send(true);
        }
        catch (e) {
            console.log(e);
            res.send(false);
        }
    });
    app.post('/register', async (req, res) => {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const mail = req.body.mail_id;
        const username = req.body.username;
        const password = req.body.password;
        try {
            const salt_rounds = 10;
            const hash = await bcrypt.hash(password, salt_rounds);
            await pool.query(`
                INSERT INTO public.users (first_name, last_name, mail_id, username, user_password) 
                VALUES ($1,$2,$3,$4,$5);`, [first_name, last_name, mail, username, hash]);
            res.status(200).send("Successfully Created User" + username);
        }
        catch (e) {
            console.log(e);
        }
    });
    app.post('/login', async (req, res) => {
        let param, differ;
        if (req.body.mail_id) {
            param = "mail_id";
            differ = req.body.mail_id;
        }
        else {
            param = "username";
            differ = req.body.username;
        }
        try {
            console.log(param, differ);
            const contents = await pool.query(`SELECT ${param},user_password FROM users WHERE ${param} = $1`, [differ]);
            if (contents) {
                console.log(contents.rows[0]);
                if (await bcrypt.compare(req.body.password, contents.rows[0].user_password)) {
                    console.log("password matched");
                }
                else {
                    console.log("Wrong password");
                }
            }
        }
        catch (e) {
            console.log("EERROORRR!!!!!!!!!!!!!!!!!!!" + e);
        }
    });
}
catch (e) {
    console.log(e);
}
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}`));
//# sourceMappingURL=index.js.map