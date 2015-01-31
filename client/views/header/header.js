Template.header.events({
	'click .account-link': function(e){
		e.preventDefault();

		var app = $('.application');
		app.toggleClass('with-account');

		if (app.hasClass('with-account')){
			Blaze.render(Template.account, $('.header').get(0));
		} else{
			Meteor.setTimeout(function(){
				$('.account').remove();
			}, 400);
		}
	}
});