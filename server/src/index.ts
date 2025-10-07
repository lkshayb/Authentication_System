import express from "express";
import type {Request,Response} from "express";
import { Pool } from 'pg';
require('dotenv').config()
const app = express();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL 
})

app.get('/test',(req:Request,res:Response) => {
    res.send(true);
})

app.post('/signup',async (req:Request,res:Response) => {
    const mail_id = req.body.mailid;
    const name = req.body.name;
    const password = req.body.password;

    const fetch = await pool.query(
        "SELECT "
    )



})