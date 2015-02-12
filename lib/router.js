Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
})

Router.onBeforeAction('loading');

StoryListController = RouteController.extend({
  template: 'storyList',
  increment: 15, 
  storyLimit: function() {
  	var currentLimit = Session.get('limit');
    return currentLimit || this.increment; 
  },
  findOptions: function() {
  	var sortBy = Session.get('sortBy') || 'date';
  	console.log(sortBy);

  	if (sortBy == 'date')
	    return {sort: {publishedOn: -1}, limit: this.storyLimit()};
	else 
		return {sort: {score: -1}, limit: this.storyLimit()};
  },
  subscriptions: function() {
    this.storySub = Meteor.subscribe('publishedStories', this.findOptions());
  },
  stories: function() {
    return Stories.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.stories().count() === this.storyLimit();
    var nextPath = this.route.path({storyLimit: this.storyLimit() + this.increment});
    return {
      stories: this.stories(),
      ready: this.storySub.ready,
      nextPath: hasMore ? nextPath : null
    };
  },
  action: function(){
  	GAnalytics.pageview("landing");
	this.render();
  }
});

Router.route('/', {
	name: 'storyList'
});

Router.route('dashboard', {
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

Router.route('login', {
	path: '/login',
	action: function(){
		GAnalytics.pageview("login");
		this.render();
	}
})

Router.route('userStories', {
	path: '/:username',
	waitOn: function(){
		return Meteor.subscribe('userStories', this.params.username); 
	},
	action: function(){
		GAnalytics.pageview("user stories:" + this.params.username);
		this.render();
	}
})

Router.route('storySingle', {
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