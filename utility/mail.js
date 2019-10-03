const sgMail = require('@sendgrid/mail');

/* 
	Setup mailling services
	_____________________________________________________________________________
*/
const { apikkey } = require('./config')
sgMail.setApiKey(apikkey);
/* _____________________________________________________________________________ */


module.exports = sgMail;