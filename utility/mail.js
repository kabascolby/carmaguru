const sgMail = require('@sendgrid/mail');

/* 
	Setup mailling services
	_____________________________________________________________________________
*/
sgMail.setApiKey('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');
/* _____________________________________________________________________________ */


module.exports = sgMail;