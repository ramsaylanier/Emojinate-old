Template.storyList.rendered = function(){
	console.log('rendered');
	Meteor.defer(function(){
		$('.user-story').removeClass('off-page');
	})
}

Template.storyList.events({
	'click .get-started-link': function(e){
		GAnalytics.event("landing","get started","click");
	}
})

Template.storyList.helpers({
	randomEmojis: function(){
		var emojis = _.map(_.sample(_.filter(Meteor.emojis(), function(emoji){
				return _.indexOf(['places', 'other'], emoji.category) == -1; 
			}), 5), 
			function(emoji){
				return {shortname: emoji.shortname, category: emoji.category};
			});

		return emojis;
	},
	noUser: function(){
		if (!Meteor.userId())
			return true
	}
});

Template.storyListExcerpt.rendered = function(){
	console.log('rendered');
	Meteor.defer(function(){
		$('.user-story').removeClass('off-page');
	})
}

Template.storyListExcerpt.events({
	'click .up-vote-btn': function(e, template){
		e.preventDefault();

		var currentUser = Meteor.userId();
		var storyId = template.data._id;

		console.log(storyId);

		if (!currentUser){
			throwError('You must login to upvote.', 'error');
		} else {
			Meteor.call('upvoteStory', currentUser, storyId, function(error){
				if (error)
					throwError(error.reason, 'error');
			});
		}
	}
});

Template.storyListExcerpt.helpers({
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
		if (this.text.length > 140){
			return this.text.substr(0, 140) + '...'
		} else {
			return this.text;
		}
	},
	score: function(){
		return this.score || 0;
	},
	upvoted: function(){
		var voted = _.contains(this.voters, Meteor.userId());

		if (voted)
			return 'upvoted'
	}
})