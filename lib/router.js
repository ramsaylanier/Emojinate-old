Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
})

Router.onBeforeAction('loading');
Router.onBeforeAction(function(){
	clearErrors();
	this.next();

});

Router.map(function(){
	this.route('storyList', {
		path: '/',
		waitOn: function(){
			return Meteor.subscribe('publishedStories');
		},
		data: function(){
			return Stories.find({},{sort: {publishedOn: -1}});
		},
		action: function(){
			GAnalytics.pageview("landing");
			this.render();
		}
	});

	this.route('dashboard', {
		path: '/dashboard',
		waitOn: function(){
			return Meteor.subscribe('userStories');
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

	this.route('storySingle', {
		path: '/story/:_id',
		waitOn: function(){
			return Meteor.subscribe('storySingle', this.params._id);
		},
		data: function(){
			return Stories.findOne(this.params._id);
		},
		action: function(){
			GAnalytics.pageview("story: ID - " + this.params._id);
			this.render();
		}
	});
});