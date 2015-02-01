Template.login.rendered = function(){
	Session.set('loginPage', null);
}

Template.login.events({
	'submit .login-form': function(e){
		e.preventDefault();

		var userName = $(e.target).find('[name="username"]').val();
		var password = $(e.target).find('[name="password"]').val();

		if (!userName){
			throwError('Please enter a username', 'error');
			return false;
		}

		if (!password){
			throwError('Please enter a password', 'error');
			return false;
		}

		Meteor.loginWithPassword(userName, password, function(error){
			if (error)
				throwError(error.reason, 'error')
			else{
				GAnalytics.event("account","signin");
				Session.set('loginPage', null);
				Router.go('/');
			}
		})
	},
	'submit .register-form': function(e){
		e.preventDefault();

		var user = {
			username: $(e.target).find('[name="username"]').val(),
			email: $(e.target).find('[name="email"]').val(),
			password: $(e.target).find('[name="password"]').val(),
		}

		var passwordConfirm = $(e.target).find('[name="password-confirm"]').val();

		if (!user.username)
			throwError("Please enter a username.", 'error');

		else if (!user.email)
			throwError("Please enter an email address.", 'error');

		else if (!user.password)
			throwError("Please enter a password.", 'error');

		else if (user.password.length < 6)
			throwError("Passwords is less that 6 character.", 'error');

		else if (user.password != passwordConfirm){
			throwError("Passwords do not match.", 'error');
		}

		else (
			Accounts.createUser({email: user.email, password: user.password, username: user.username }, function(error){
				if (error){
					GAnalytics.event("account","registration", "error", error.reason);
					throwError(error.reason, 'error');
				}
				else {
					GAnalytics.event("account","registration","success");
					Session.set('loginPage', null);
					Router.go('/');
				}
			})
		)
	},
	'click .register-link': function(e){
		Session.set('loginPage', 'register');

		Meteor.setTimeout(function(){
			$('.form-control').removeClass('off-page');
		})
	},
	'click .forgot-password-link': function(e){
		Session.set('loginPage', 'forgotPassword');

		Meteor.setTimeout(function(){
			$('.form-control').removeClass('off-page');
		})
	},
	'submit .forgot-password-form': function(e){
		e.preventDefault();
		var email = $(e.target).find('[name=email]').val();

		if (!email){
			throwError('Please enter your registered email address.', 'error');
		}

		Accounts.forgotPassword({email: email}, function(error){
			if (error){
				throwError(error.reason, 'error');
			} else {
				Session.set('loginPage', null);
				throwError('Password sent to your registered email address.', 'error');

			}
		})
	},
	'click .twitter-login-link': function(e){
		e.preventDefault;

		Meteor.loginWithTwitter(function(error){
			if (error)
				console.log(error);
			else
				Router.go('/dashboard');
		})
	}
})

Template.login.helpers({
	'userFirstName': function(){
		return Meteor.users.findOne().firstName;
	},
	'registerPage': function(){
		var loginPage = Session.get('loginPage');

		if (loginPage == 'register'){
			$('.form-control').removeClass('off-page');
			return true
		}
	},
	'forgotPassword': function(){
		var loginPage = Session.get('loginPage');

		if (loginPage == 'forgotPassword'){
			$('.form-control').removeClass('off-page');
			return true
		}
	}
})