Meteor.publish('storySingle', function(storyId){
	return Stories.find(storyId);
})

Meteor.publish('userStories', function(){
	return Stories.find({author: this.userId});
})

Meteor.publish('publishedStories', function(){
	return Stories.find({published: true});
})