Accounts.onResetPasswordLink(function(token, done){
	Blaze.renderWithData(Template.resetPasswordModal, token, $('body').get(0));
	done();
});