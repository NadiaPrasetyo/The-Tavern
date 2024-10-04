const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // 587 for STARTTLS; 465 for SSL
    secure: true, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.TEAM_EMAIL,
      pass: process.env.TEAM_EMAIL_APP_PASSWORD,
    }
});

// Send bug report email
const handler = async (req) => {
    const { description, location, browser, version, date, from_email, name } = JSON.parse(req.body);

    const mailOptions = {
        from: process.env.TEAM_EMAIL,
        to: process.env.TEAM_EMAIL,
        subject: `Bug Report ${date} ${location}`,
        text: `
            Date: ${date}
            Page: ${location}
            Bug Description: 
            ${description}
            Browser: ${browser}
            Version: ${version}
            From: ${from_email}`,
    };

    const replyOptions = {
        from: process.env.TEAM_EMAIL,
        to: from_email,
        subject: "Bug Report Received",
        text: `
            Kia ora ${name},

            Thank you for submitting a bug report. We have received the following details:
    
            Description: 
            ${description}
            Page: ${location}
            Browser: ${browser}
            Version: ${version}

            Our team will review the issue and get back to you if further information is needed.

            Best regards,
            The Tavern Support Team.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(replyOptions);

        return { statusCode: 200, body: 
            JSON.stringify({ message: "Bug report sent successfully." })
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};

module.exports = { handler };