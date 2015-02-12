Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
})

Router.onBeforeAction('loading');

Router.map(function(){
	this.route('storyList', {
		path: '/',
		waitOn: function(){
			var sortBy = Session.get('sortBy');
			var limit = 30;

			if (sortBy == 'date')
				return Meteor.subscribe('publishedStories', {sort: {publishedOn: -1}, limit: limit});
			else 
				return Meteor.subscribe('publishedStories', {sort: {score: -1}, limit: limit});
		},
		data: function(){
			return Stories.find({});
		},
		action: function(){
			GAnalytics.pageview("landing");
			this.render();
		}
	});

	this.route('dashboard', {
		path: '/dashboard',
		waitOn: function(){
			return Meteor.subscribe('dashboardStories', Meteor.userId());
		},
		action: function(){
			if (!Meteor.userId()){
				this.redirect('/');
			} else {
				GAnalytics.pageview("dashboard");
				this.render();
			}
		}
	})

	this.route('login', {
		path: '/login',
		action: function(){
			GAnalytics.pageview("login");
			this.render();
		}
	})

	this.route('userStories', {
		path: '/:username',
		waitOn: function(){
			return Meteor.subscribe('userStories', this.params.username); 
		},
		action: function(){
			GAnalytics.pageview("user stories:" + this.params.username);
			this.render();
		}
	})

	this.route('storySingle', {
		path: '/story/:_id',
		waitOn: function(){
			return Meteor.subscribe('storySingle', this.params._id);
		},
		data: function(){
			return Stories.findOne(this.params._id);
		},
		onBeforeAction: function(){
			var story = Stories.findOne(this.params._id);
			console.log(Meteor.userId());
			console.log(story.author);
			if (story.published || story.author === Meteor.userId()){
				this.next();
			} else {
				this.redirect('/');
			}
		},
		action: function(){
			GAnalytics.pageview("story: ID - " + this.params._id);
			this.render();
		}
	});
});