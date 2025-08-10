import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
port: 587,
auth: {

})

export default transporter