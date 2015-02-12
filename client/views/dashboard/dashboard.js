Template.dashboard.rendered = function(){
	Meteor.defer(function(){
		$('.user-story').removeClass('off-page');
	})
}


Template.dashboard.events({
	'click .create-story-btn': function(e){
		e.preventDefault();

		if (!Meteor.userId())
			throwError('You must be logged in to create a story', 'error')
		else{
			Meteor.call('createStory', function(error, result){
				if (error)
					throwError(error.reason, 'error')
				else{
					Router.go('/story/' + result);
				}
			})
		}
	}
})

Template.dashboard.helpers({
	userStories: function(){
		return Stories.find({},{sort: {editedOn: -1}});
	}
});

Template.dashboardExcerpt.events({
	'click .story-link': function(e){
		e.preventDefault();
		var target = $(e.currentTarget);
		var url = target.attr('href');
		var moveAmt = 60;

		$('.user-story').velocity({
			opacity: 0,
			translateY: moveAmt
		});

		$('.dashboard-header').velocity({
			opacity: 0,
			translateY: moveAmt
		})

		Meteor.setTimeout(function(){
			Router.go(url);
		}, 600);
	}
})

Template.dashboardExcerpt.helpers({
	publishedOnDate: function(){
		if (this.publishedOn)
			return moment(this.publishedOn).format('MMM D');
		else 
			return moment(this.createdOn).format('MMM D');
	},
	publishedOnYear: function(){
		if (this.publishedOn)
			return moment(this.publishedOn).format('YYYY');
		else 
			return moment(this.createdOn).format('YYYY');
	},
	textExcerpt: function(){
		if (this.text.length > 500){
			return this.text.substr(0, 500) + '...'
		} else {
			return this.text;
		}
	}
})