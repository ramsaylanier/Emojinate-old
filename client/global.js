Accounts.onResetPasswordLink(function(token, done){
	Blaze.renderWithData(Template.resetPasswordModal, token, $('body').get(0));
	done();
});

Meteor.startup(function(){
	var loginStyle = "popup";

	if (Meteor.Device.isPhone()){
		loginStyle = "redirect";
	}

	Meteor.call('serviceConfig', loginStyle, function(error){
		if (error)
			Errors.throw(error.reason, 'error')
	})
})