var nodemailer = require('nodemailer');
exports.mailSend=function(email,code,sub){
  console.log(code);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lms.node@gmail.com',
    pass: 'gadgeon2017'
  }
});
var message = code+'';

var mailOptions = {
  from: 'lms.node@gmail.com',
  to: email,
  subject: sub,
  text: message
};


transporter.sendMail(mailOptions, function(error, info){

  if (error) {
    console.log(error);
  } else {

    console.log('Email sent: ' + info.response);
  }
});

}
