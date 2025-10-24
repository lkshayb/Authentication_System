import express from 'express'
const router = express.Router();
import type {Request,Response} from "express";
import {sendOtpEmail} from "./functions.js";
import cors from "cors";
import bodyParser from "body-parser"
router.use(express.json());
router.use(cors());
router.use(bodyParser.json());

const otpStore: { [contact: string]: OtpEntry } = {};
interface OtpEntry {
    otp: string;
    expiresAt: number;
    attempts: number;
}

router.post('/send',async (req:Request,res:Response) => {
    const { contact } = req.body;
    
    if (!contact || !contact.includes('@')) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = (Date.now() + 5 * 60 * 1000) // 5 minutes

    otpStore[contact] = { otp, expiresAt, attempts: 0 };
    console.log(otpStore)
    try {
        await sendOtpEmail(contact, otp);

        if (process.env.NODE_ENV !== 'production') {
            console.log(`OTP for ${contact}: ${otp}`);
        }
        return res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }
})

router.post('/verify',async (req:Request,res:Response) => {
    const otp = req.body.otp;
    const contact = req.body.contact;

    if(!otp || !contact) {
        return res.status(404).send("No OTP or Contact number received.")
    }
    const record = otpStore[contact];
    console.log(record);
    console.log(otp,record)

    if(!record) res.status(400).send({success:false,message:'No record for OTP found for this contact.'})
    else if(Date.now() > record.expiresAt){
        res.status(400).send({success:false,message:'OTP has been expired.'})
    }
    else if(otp === record.otp){
        res.status(200).send({success:true,message:"OTP Verified"})
    }
    else if(otp != record.otp){{
        res.status(400).send({success:false,message:"Wrong OTP"})
    }}
    else{
        res.status(400).send({success:false,message:"Unexpected error occured"})
    }
})

export default router