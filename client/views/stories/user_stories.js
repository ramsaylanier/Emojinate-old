Template.userStories.rendered = function(){
	Session.set('sortBy', 'score');
}

Template.userStories.helpers({
	username: function(){
		return Iron.controller().params.username;
	},
	stories: function(){
		var sortBy = Session.get('sortBy');

		if (sortBy == 'score')
			return Stories.find({}, {sort: {score: -1}});
		else
			return Stories.find({}, {sort: {publishedOn: -1}});
	}
});

Template.userStories.events({
	
})