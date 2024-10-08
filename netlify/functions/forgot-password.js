const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { database } = require('./db');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // 587 for STARTTLS; 465 for SSL
    secure: true, // use false for STARTTLS; true for SSL on port 465
    auth: {
        user: process.env.TEAM_EMAIL,
        pass: process.env.TEAM_EMAIL_APP_PASSWORD,
    }
});

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// send reset password email
const handler = async (req) => {
    const { username } = JSON.parse(req.body);
    console.log(username);

    try {
        const collection = database.collection('User'); // your users collection
        const user = await collection.findOne({ username: username });


        if (user) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

            // Save token and tokenUsed to false in the database
            await collection.updateOne({ username: user.username }, 
                { $set: { resetPasswordToken: token, 
                    resetPasswordTokenUsed: false } });

            const mailOptions = {
                from: process.env.TEAM_EMAIL,
                to: user.email,
                subject: "Reset Password",
                html: `
                <p>Kia ora ${user.name},</p>
            
                <p>You have requested to reset your password. Please click the button below to reset your password:</p>
                
                <a href='https://the-tavern-menu.netlify.app/reset-password?token=${token}' 
                   style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #708871; text-decoration: none; border-radius: 5px;">
                   Reset Password
                </a>
            
                <p>If you did not request a password reset, please ignore this email.</p>
            
                <p>Best regards,<br/>The Tavern Support Team.</p>
                `,
            };

            await transporter.sendMail(mailOptions);

            return { statusCode: 200, body: JSON.stringify({ message: "Reset password email sent successfully." }) };
        } else {
            return { statusCode: 404, body: JSON.stringify({ message: "User not found." }) };
        }
    }
    catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}


module.exports = { handler };