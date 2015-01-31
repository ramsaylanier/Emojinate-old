Template.resetPasswordModal.events({
	'submit .reset-password-form': function(e, template){
		e.preventDefault();

		var password = $(e.target).find('[name="password"]').val();
		var passwordConfirm = $(e.target).find('[name="password-confirm"]').val();
		var token = template.data;

		if (!password)
			throwError("Please enter a password.", 'error');

		else if (password.length < 6)
			throwError("Passwords is less that 6 character.", 'error');

		else if (password != passwordConfirm){
			throwError("Passwords do not match.", 'error');
		}

		else (
			Accounts.resetPassword(token, password, function(error){
				if (error)
					throwError(error.reason, 'error');
				else {
					throwError('Password Reset.', 'error');
					$('.modal').remove();
					Session.set('loginPage', null);
					Router.go('/');
				}
			})
		)
	}
})