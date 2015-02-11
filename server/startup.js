//remove any old configurations on startup
ServiceConfiguration.configurations.remove();

Meteor.methods({
	serviceConfig: function(loginStyle){
		ServiceConfiguration.configurations.upsert(
		{ service: "twitter" },
		{
			$set: {
			  consumerKey: Meteor.settings.twitter.public,
			  loginStyle: loginStyle,
			  secret: Meteor.settings.twitter.private
			}
		});
	}
});