var author, storyId;

Template.storySingle.rendered = function(){
	author = this.data.author;
	storyId = this.data._id;

	Meteor.defer(function(){
		$('.story-header').removeClass('off-page');
	});

	if ($('.emoji-string').length){

		var element = $('.emoji-string');
		var target = element.offset().top + element.outerHeight();

		$(window).on('scroll', function(){
			var pos = $(window).scrollTop();

			if (pos > target)
				element.addClass('sticky');
			else 
				element.removeClass('sticky');
		})
	}
}

Template.storySingle.helpers({
	author: function(){
		if (Meteor.userId() == this.author)
			return true;
	},
	editable: function(type){
		return '<div class="story-' + type + '" contenteditable="true">' + this[type]+ '</div>'
	},
	tweet: function(){
		var text = this.text;
		var emojis = $('.emoji img');
		var emojiString = _.pluck(emojis, 'alt').join('');
		var url = encodeURI(window.location.href);

		console.log(url);
		return "https://twitter.com/intent/tweet?text=" + text + ' ' + emojiString + '&url=' + url;
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
	'paste .story-text': function(e){
		// cancel paste
	    e.preventDefault();

	    // get text representation of clipboard
	    var text = e.originalEvent.clipboardData.getData("text/plain");

	    // insert text manually
	    document.execCommand("insertHTML", false, text);
	}
});