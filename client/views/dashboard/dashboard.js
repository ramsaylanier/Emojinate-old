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

Template.dashboardExcerpt.helpers({
	publishedOnDate: function(){
		return moment(this.publishedOn).format('MMM D');
	},
	publishedOnYear: function(){
		return moment(this.publishedOn).format('YYYY');
	},
	emojiExcerpt: function(){
		var emojis = _.first(_.pluck(this.emojis, 'shortname'), 3);
		return emojis;
	},
	textExcerpt: function(){
		return this.text.substr(0, 140);
	}
})