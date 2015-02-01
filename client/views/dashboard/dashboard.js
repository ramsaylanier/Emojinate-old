Template.dashboard.rendered = function(){
	var excerpts = $('.user-story');

	_.each(excerpts, function(excerpt, index){
		Meteor.setTimeout(function(){
			$(excerpt).removeClass('off-page');
		}, 100 * index);
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
		var stories = $('.user-story');
		var target = $(e.currentTarget);
		var url = target.attr('href');
		var moveAmt = 60;

		_.each(stories, function(story, index){
			Meteor.setTimeout(function(){
				$(story).velocity({
					opacity: 0,
					translateY: moveAmt
				});
			}, 100 * index);
		});

		$('.dashboard-header').velocity({
			opacity: 0,
			translateY: moveAmt
		})

		Meteor.setTimeout(function(){
			Router.go(url);
		}, (110 * stories.length) + 300);
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
	emojiExcerpt: function(){
		var emojis = _.first(_.pluck(this.emojis, 'shortname'), 3);
		return emojis;
	},
	textExcerpt: function(){
		return this.text.substr(0, 140);
	}
})