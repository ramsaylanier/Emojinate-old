Stories = new Mongo.Collection('stories');

Meteor.methods({
	createStory: function(){
		if (!this.userId)
			throw new Meteor.Error(422, 'You must login to create a story.');

		var emojis = generateEmojis();
		var authorName = Meteor.users.findOne({_id: this.userId}).username;

		var story = Stories.insert({published: false, author: this.userId, authorName: authorName, emojis: emojis, title: 'Enter Title Here', text: 'Enter Translation Here'});

		return story;
	},
	insertEmojis: function(storyId, author){
		if (!this.userId)
			throw new Meteor.Error(422, 'You must login to create a story.');

		if (this.userId != author)
			throw new Meteor.Error(422, 'You must be the author to generate emjois.');


		var emojis = generateEmojis();
		var story = Stories.update({_id: storyId}, {$set: {emojis: emojis}});

		return story;
	},
	saveStory: function(storyId, author, storyFields){
		if (!this.userId)
			throw new Meteor.Error(422, 'You must login to emojinate.');

		if (this.userId != author)
			throw new Meteor.Error(422, 'You must be the author to save.');

		if (storyFields.title == 'Enter Title Here')
			throw new Meteor.Error(422, 'Please give your Emojination a title. Be creative.');

		if (storyFields.text == 'Enter Translation Here')
			throw new Meteor.Error(422, 'Try harder. You didnt even attempt a translation.' );

		var authorName = Meteor.users.findOne({_id: this.userId}).username;

		var story = Stories.update({_id: storyId}, {$set: {title: storyFields.title, authorName: authorName, text: storyFields.text, editedOn: new Date()} } );;

		return story;
	},
	publishStory: function(storyId, author, storyFields){
		if (!this.userId)
			throw new Meteor.Error(422, 'You must login to emojinate.');

		if (this.userId != author)
			throw new Meteor.Error(422, 'You must be the author to publish.');

		if (storyFields.title == 'Enter Title Here')
			throw new Meteor.Error(422, 'Please give your Emojination a title. Be creative.');

		if (storyFields.text == 'Enter Translation Here')
			throw new Meteor.Error(422, 'Try harder. You didnt even attempt a translation.' );

		Meteor.call('saveStory', storyId, author, storyFields, function(error){
			if (error)
				throw new Meteor.Error(422, error.reason);
			else {
				var story = Stories.update({_id: storyId}, {$set: {published: true, publishedOn: new Date()}});
				return story;
			}
		});
	},
	unpublishStory: function(storyId, author){
		if (!this.userId)
			throw new Meteor.Error(422, 'You must login to emojinate.');

		if (this.userId != author)
			throw new Meteor.Error(422, 'You must be the author to unpublish.');

		var story = Stories.update({_id: storyId}, {$set: {published: false}});
		return story;
	},
	deleteStory: function(storyId, author){
		if (!this.userId)
			throw new Meteor.Error(422, 'You must login to emojinate.');

		if (this.userId != author)
			throw new Meteor.Error(422, 'You must be the author to delete emojinations.');

		Stories.remove(storyId);
	}
})

function generateEmojis(){
	var emojis = _.map(_.sample(_.filter(Meteor.emojis(), function(emoji){
		return _.indexOf(['places', 'other'], emoji.category) == -1; 
	}), 5), 
	function(emoji){
		return {shortname: emoji.shortname, category: emoji.category};
	});

	return emojis;
}