Template.layout.events({
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