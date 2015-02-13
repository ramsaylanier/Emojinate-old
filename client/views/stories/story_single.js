var author, storyId;

Template.storySingle.rendered = function(){
	author = this.data.author;
	storyId = this.data._id;

	Meteor.defer(function(){
		$('.story-header').removeClass('off-page');
	});
}

Template.storySingle.helpers({
	author: function(){
		if (Meteor.userId() == this.author)
			return true;
	},
	editable: function(type){
		return '<div class="story-' + type + '" contenteditable="true">' + this[type]+ '</div>'
	},
	upvoted: function(){
		var voted = _.contains(this.voters, Meteor.userId());

		if (voted)
			return 'upvoted'
	}
})

function authorize(template){
	if (Meteor.userId() == author )
		return true
}

function getStoryFields(){

	var storyFields = {
		title: $('.story-title').html(),
		text: $('.story-text').html()
	}	
	return storyFields;
}

Template.storySingle.events({
	'click .regenerate-btn': function(e, template){
		e.preventDefault();

		if (authorize(template)){
			Meteor.call('insertEmojis', storyId, author, function(error){
				if(error)
					throwError(error.reason, 'error')
			})
		}
	},
	'click .publish-story-btn': function(e, template){
		e.preventDefault();

		if (authorize(template)){
			var storyFields = getStoryFields();

			Meteor.call('publishStory', storyId, author, storyFields, function(error){
				if (error){
					GAnalytics.event("story","publish","error", error.reason);
					throwError(error.reason, 'error');
				} else {
					GAnalytics.event("story","publish","success");
					throwError('Story successfully published.', 'error');
					Router.go('/');
				}
			});
		} else {
			throwError('You are not the story Author.');
		}
	},
	'click .save-story-btn': function(e, template){
		e.preventDefault();

		if (authorize(template)){
			var storyFields = getStoryFields();

			Meteor.call('saveStory', storyId, author, storyFields, function(error){
				if (error){
					throwError(error.reason, 'error');
				} else {
					throwError('Story successfully saved.', 'error');
				}
			});
		} else {
			throwError('You are not the story Author.');
		}
	},
	'click .unpublish-story-btn': function(e, template){
		e.preventDefault();

		if (authorize(template)){
			Meteor.call('unpublishStory', storyId, author, function(error){
				if (error){
					throwError(error.reason, 'error');
				} else {
					throwError('Story unpublished.', 'error');
				}
			});
		} else {
			throwError('You are not the story Author.');
		}
	},
	'click .delete-story-btn': function(e, template){
		e.preventDefault();

		if (authorize(template)){
			Meteor.call('deleteStory', storyId, author, function(error){
				if (error){
					throwError(error.reason, 'error');
				} else {
					Router.go('/dashboard');
					throwError('Story deleted.', 'error');
				}
			});
		} else {
			throwError('You are not the story Author.');
		}
	},
	'click .tweet-btn': function(e, template){
		e.preventDefault();

		var text = '"' + template.data.text.replace(/&nbsp;/gi,'').substr(0, 83) + '..."';
		var emojis = $('.emoji img');
		var emojiString = _.pluck(emojis, 'alt').join('');
		var url = encodeURI(window.location.href);

		window.open('https://twitter.com/intent/tweet?text=' + text + ' ' + emojiString + '&via=emojinateapp&url=' + url, '_blank');
	},
	'paste .story-text': function(e){
		// cancel paste
	    e.preventDefault();

	    // get text representation of clipboard
	    var text = e.originalEvent.clipboardData.getData("text/plain");

	    // insert text manually
	    document.execCommand("insertHTML", false, text);
	},
	'paste .story-title': function(e){
		// cancel paste
	    e.preventDefault();

	    // get text representation of clipboard
	    var text = e.originalEvent.clipboardData.getData("text/plain");

	    // insert text manually
	    document.execCommand("insertHTML", false, text);
	},
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