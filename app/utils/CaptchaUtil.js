/**
 * Created by SiuWongLi on 17/5/2.
 */
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'paihuai-1994@163.com',
        pass: 'syj520'
    }
});
let mailOptions = {
    from: '"评教系统小管家" <paihuai-1994@163.com>', // sender address
    subject: '浙江工业大学评教系统',
}
var obj= {
    sendEmail:(to,code,cb)=>{
        mailOptions.to = to;
        mailOptions.html =`<b>您好</b>，<br/>&nbsp&nbsp您的验证码为：${code}。有效期为:10分钟。`;
        transporter.sendMail(mailOptions,cb);
    },
    generateCaptchaCode:()=>{
        var value ='';
        for(var i= 0;i<6;i++){
            value +=parseInt(Math.random()*10);
        }
        return value;
    }
}
module.exports = obj;