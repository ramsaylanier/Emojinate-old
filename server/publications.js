Meteor.publish('storySingle', function(storyId){
	return Stories.find(storyId);
})

Meteor.publish('dashboardStories', function(userId){
	return Stories.find({author: userId});
})

Meteor.publish('userStories', function(username){
	console.log(username);
	var user = Meteor.users.findOne({username: username});
	console.log(user);
	return Stories.find({author: user._id, published: true});
})


Meteor.publish('publishedStories', function(limit){
	return Stories.find({published: true}, {limit: limit, sort: {publishedOn: -1}});
})