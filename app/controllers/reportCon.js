const _ = require('lodash');
const nodemailer = require('nodemailer');
const postReport = require('../models/RepPostModel');

const reportCon = {};

reportCon.reportPost = async (req, res) => {
    const { postId } = req.params;
    const body = _.pick(req.body, ['reason']);

    try {
       
        const report = new postReport({
            postId,
            reason: body.reason,
        });

        
        await report.save();

        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ysrinivas4901@gmail.com',
                pass: 'wtqg hbwz lfhb wwaj',
            },
        });
        const sendReport = async (report) => {
            const mailOptions = {
                from: 'ysrinivas4901@gmail.com',
                to: 'ragavbts@gmail.com',
                subject: 'Reporting on a post',
                text: `A new report has been submitted for the post ${report.postId}, Reason: ${report.reason}`,
            };

         
            await transporter.sendMail(mailOptions);
        };

        
        await sendReport(report);

        
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (e) {
        console.error('Error submitting report:', e.message);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};
module.exports = reportCon;