const sgMail = require('@sendgrid/mail');

/* 
	Setup mailling services
	_____________________________________________________________________________
*/
sgMail.setApiKey(API_KEY);
/* _____________________________________________________________________________ */


module.exports = sgMail;