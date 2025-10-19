import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const otpStore = {};
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});
try {
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
    app.post('/otp-sender', async (req, res) => {
        const { contact } = req.body;
        if (!contact || !contact.includes('@')) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = (Date.now() + 5 * 60 * 1000); // 5 minutes
        otpStore[contact] = { otp, expiresAt, attempts: 0 };
        console.log(otpStore);
        try {
            await sendOtpEmail(contact, otp);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`OTP for ${contact}: ${otp}`);
            }
            return res.json({ success: true, message: 'OTP sent to your email' });
        }
        catch (error) {
            console.error("Error sending OTP:", error);
            return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
        }
    });
    app.post('/otp-verify', async (req, res) => {
        const otp = req.body.otp;
        const contact = req.body.contact;
        if (!otp || !contact) {
            return res.status(404).send("No OTP or Contact number received.");
        }
        const record = otpStore[contact];
        console.log(record);
        console.log(otp, record);
        if (!record)
            res.status(400).send({ success: false, message: 'No record for OTP found for this contact.' });
        else if (Date.now() > record.expiresAt) {
            res.status(400).send({ success: false, message: 'OTP has been expired.' });
        }
        else if (otp === record.otp) {
            res.status(200).send({ success: true, message: "OTP Verified" });
        }
        else if (otp != record.otp) {
            {
                res.status(400).send({ success: false, message: "Wrong OTP" });
            }
        }
        else {
            res.status(400).send({ success: false, message: "Unexpected error occured" });
        }
    });
    app.post('/register', async (req, res) => {
        // req : first name,last name,mail id, username, password
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
            res.status(200).send("Successfully Created User " + username);
        }
        catch (e) {
            console.log(e);
        }
    });
}
catch (e) {
    console.log(e);
}
async function sendOtpEmail(to, otp) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: "Verify your Email",
        to,
        subject: "Please use this One Time Password (OTP) to verify your mail id.",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes. Please don't share it to anyone, for your own safety and privacy.</p>`,
    });
}
const PORT = process.env.PORT;
try {
    app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}/test`));
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=index.js.map