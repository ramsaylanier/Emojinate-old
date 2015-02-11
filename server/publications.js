Meteor.publish('storySingle', function(storyId){
	return Stories.find(storyId);
})

Meteor.publish('userStories', function(){
	return Stories.find({author: this.userId});
})

Meteor.publish('publishedStories', function(limit){
	return Stories.find({published: true}, {limit: limit, sort: {score: -1, publishedOn: -1}});
})