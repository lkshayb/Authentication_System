import express from "express";
import cors from "cors";
import bodyParser from "body-parser"
import type {Request,Response} from "express";
import { Pool } from 'pg';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import otprouters from './OtpRouter.js'

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",   // Vite
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL 
})

try{
    
    app.use('/otp',otprouters)

    app.post('/ifexist',async (req:Request,res:Response) => {
        const mail_id = req.body.mailid;
        try{
            await pool.query(`SELECT mail_id FROM users WHERE mail_id=$1;`,[mail_id])
            res.send(true);
        }catch(e){
            console.log(e)
            res.send(false);
        }
    })

    app.post('/register', async (req:Request,res:Response) => {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const mail = req.body.mail_id;
        const username = req.body.username;
        const password = req.body.password;

        try{
            const salt_rounds = 10;
            const hash = await bcrypt.hash(password, salt_rounds);

            await pool.query(`
                INSERT INTO public.users (first_name, last_name, mail_id, username, user_password) 
                VALUES ($1,$2,$3,$4,$5);`,
                [first_name,last_name,mail,username,hash]
            )
            res.status(200).send("Successfully Created User"+username);
        }
        catch(e){
            console.log(e)
        }
    })

    app.post('/login',async (req:Request,res:Response) => {
        console.log("RAW BODY:", req.body);
        const { mail_id, username, password } = req.body;
        const param = mail_id ? "mail_id" : "username";
        const differ = mail_id || username;

        console.log(param,differ,req.body.password)
        try{
            const contents = await pool.query(`SELECT user_password FROM users WHERE ${param} = $1`,[differ])
            if (contents.rows.length === 0) {
                console.log("returned from step 1")
                return res.send(false);
            }

            const hashedPassword = contents.rows[0].user_password;
            const valid = await bcrypt.compare(password, hashedPassword);
            return res.send(valid);
        }catch(e) {res.send(false);}
    })

}catch(e){
    console.log(e)
}

const PORT = process.env.PORT;
app.listen(PORT,() => console.log(`server is running at http://localhost:${PORT}`))



