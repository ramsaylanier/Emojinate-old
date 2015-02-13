Meteor.publish('storySingle', function(storyId){
	return Stories.find(storyId);
})

Meteor.publish('dashboardStories', function(userId){
	return Stories.find({author: userId});
})

Meteor.publish('userStories', function(username){
	var user = Meteor.users.findOne({username: username});
	return Stories.find({author: user._id, published: true});
})

Meteor.publish('publishedStories', function(options){
	return Stories.find({published: true}, options);
})

Meteor.publish('userPhoto', function(username){
	return Meteor.users.find({username: username}, {fields: {profileImage: 1}});
})