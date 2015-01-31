Template.account.events({
	'click .logout-link': function(e){
		e.preventDefault();
		$('.application').toggleClass('with-account');
		Meteor.logout(function(){
			Router.go('/');
		});
	},
	'click .change-password-link': function(e){
		e.preventDefault();
		Blaze.render(Template.changePasswordModal, $('body').get(0));
	}
})