Template.storyList.rendered = function(){
	var excerpts = $('.user-story');

	_.each(excerpts, function(excerpt, index){
		Meteor.setTimeout(function(){
			$(excerpt).removeClass('off-page');
		}, 100 * index);
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
			}), 6), 
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
	emojiExcerpt: function(){
		var emojis = _.first(_.pluck(this.emojis, 'shortname'), 3);
		return emojis;
	},
	textExcerpt: function(){
		return this.text.substr(0, 140);
	}
})