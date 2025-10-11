import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});
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
        from: `"Auction Auth" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });
}
app.get('/test', (req, res) => {
    res.send(true);
});
app.post('/ifexist', async (req, res) => {
    const mail_id = req.body.mailid;
    try {
        await pool.query(`SELECT mail_id FROM users WHERE mail_id=${mail_id};`);
        res.send(true);
    }
    catch (e) {
        console.log(e);
        res.send(false);
    }
});
const otpStore = {};
app.post('/otp-sender', async (req, res) => {
    const { contact } = req.body;
    if (!contact || !contact.includes('@')) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = (Date.now() + 5 * 60 * 1000).toLocaleString(); // 5 minutes
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
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}/test`));
//# sourceMappingURL=index.js.map