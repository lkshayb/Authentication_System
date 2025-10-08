import express from "express";
import cors from "cors";
import bodyParser from "body-parser"
import type {Request,Response} from "express";
import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL 
})

app.get('/test',(req:Request,res:Response) => {
    res.send(true);
})

app.post('/ifexist',async (req:Request,res:Response) => {
    const mail_id = req.body.mailid;
    const name = req.body.name;
    const password = req.body.password;
    try{
        const fetch = await pool.query(`SELECT mail_id FROM users WHERE mail_id=${mail_id};`)
        res.send(true);
    }catch(e){
        res.send(false);
    }
})
const PORT = process.env.PORT;
app.listen(PORT,() => console.log(`server is running at http://localhost:${PORT}`))