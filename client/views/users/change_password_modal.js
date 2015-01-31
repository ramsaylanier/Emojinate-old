Template.changePasswordModal.events({
	'submit .change-password-form': function(e, template){
		e.preventDefault();

		var oldPassword = $(e.target).find('[name="old-password"]').val();
		var password = $(e.target).find('[name="password"]').val();
		var passwordConfirm = $(e.target).find('[name="password-confirm"]').val();

		if (!oldPassword)
			throwError("Please enter your existing password.", 'error');

		else if (!password)
			throwError("Please enter a new password.", 'error');

		else if (password.length < 6)
			throwError("Passwords is less that 6 character.", 'error');

		else if (password != passwordConfirm){
			throwError("Passwords do not match.", 'error');
		}

		else (
			Accounts.changePassword(oldPassword, password, function(error){
				if (error)
					throwError(error.reason, 'error');
				else {
					throwError('Password updated.', 'error');
					$('.application').toggleClass('with-account');
					$('.modal').remove();
					Router.go('/');
				}
			})
		)
	}
})