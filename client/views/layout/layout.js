Template.layout.events({
	'click .twitter-login-link': function(e){
		e.preventDefault;

		Meteor.loginWithTwitter(function(error){
			if (error)
				console.log(error);
			else
				Router.go('/dashboard');
		})
	},
	'click .about-btn': function(){
		$('.about-section').toggleClass('active');
	},
	'click .close-btn': function(){
		$('.about-section').toggleClass('active');
	},
	'click .transition-link': function(e){
		e.preventDefault();
		var target = $(e.currentTarget);
		var url = target.attr('href');

		if (url !== window.location.href && url !== window.location.pathname){

			$('.user-story').velocity({
				opacity: 0,
				translateY: 30,
			});

			$('.welcome-section').velocity({
				opacity: 0
			});

			$('.story-list-section').velocity({
				opacity: 0
			})

			Meteor.setTimeout(function(){
				Router.go(url);
			}, 600);
		}
	},
	'click .sort-date-btn': function(){
		Session.set('sortBy', 'date');
	},
	'click .sort-score-btn': function(){
		Session.set('sortBy', 'score');
	},
	'click .load-more-btn': function(){
		console.log(Iron.controller());
		var currentLimit = Session.get('limit') || 15;
		Session.set('limit', currentLimit + 15);
	}
})