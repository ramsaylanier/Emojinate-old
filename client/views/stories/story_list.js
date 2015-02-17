Template.storyList.rendered = function(){
	this.find('.user-stories')._uihooks = {
		moveElement: function(node, next){
			$('.user-story').removeClass('off-page');
			var $node = $(node), $next = $(next);

			console.log($node);
			console.log($next);
			var oldTop = $node.offset().top;
			var height = $node.outerHeight(true);

			// find all the elements between next and node
			var $inBetween = $next.nextUntil(node);
			if ($inBetween.length === 0)
			$inBetween = $node.nextUntil(next);

			// now put node in place
			$node.insertBefore(next);

			// measure new top
			var newTop = $node.offset().top;

			// move node *back* to where it was before
			$node
			.removeClass('animate')
			.css('top', oldTop - newTop);

			// push every other element down (or up) to put them back
			$inBetween
			.removeClass('animate')
			.css('top', oldTop < newTop ? height : -1 * height)


			// force a redraw
			$node.offset();

			// reset everything to 0, animated
			$node.addClass('animate').css('top', 0);
			$inBetween.addClass('animate').css('top', 0);
		}		
	}
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
		if (this.text.length > 500){
			return this.text.substr(0, 500) + '...'
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