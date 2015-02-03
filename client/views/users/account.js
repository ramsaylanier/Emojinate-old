Template.account.events({
	'click .logout-link': function(e){
		e.preventDefault();
		$('.application').toggleClass('with-account');
		Meteor.logout(function(){
			Router.go('/');
		});
	}
})