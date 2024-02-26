import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SEND_MAIL_USER,
        pass: process.env.SEND_MAIL_PASS,
    },
});


export default transporter