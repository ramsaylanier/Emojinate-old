//remove any old configurations on startup
ServiceConfiguration.configurations.remove();

Meteor.startup(function(){

	var usersWithoutImages = Meteor.users.find({profileImage: null});

	if (usersWithoutImages.count() > 0){
		Meteor.call('getTwitterPhoto', function(error){
			if (error)
				throw new Meteor.Error(error);
		});
	}
})

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
	},
	getTwitterPhoto: function(){
		var publicKey = Meteor.settings.twitter.public;
		var secretKey = Meteor.settings.twitter.private;

		var apiBase = 'https://api.twitter.com/';
		var keys = publicKey + ':' + secretKey;
		var wordArray = CryptoJS.enc.Utf8.parse(keys);
		var bearerTokenCreds = CryptoJS.enc.Base64.stringify(wordArray);
		var bearerToken = HTTP.post('https://api.twitter.com/oauth2/token', 
									{headers: {	
										"Authorization": "Basic " + bearerTokenCreds,
										"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
									}, content: "grant_type=client_credentials"
									});
		var accessToken = bearerToken.data.access_token;

		//find the first 100 users without profileImages
		var users = Meteor.users.find({profileImage: null}, {fields: {username: 1}, limit: 100}).fetch();

		//get usernames of users and convert plucked array to string
		var userNames = _.pluck(users, 'username').toString();

		var result = HTTP.get("https://api.twitter.com/1.1/users/lookup.json?screen_name=" + userNames,
						{headers:{
							"Authorization": "Bearer " + accessToken
						}});
		
		//create object from usernames array and images array
		var images = _.zip(_.pluck(users, 'username'), _.pluck(result.data, 'profile_image_url'));

		_.each(images, function(image){
			Meteor.users.update({username: image[0]}, {$set: {profileImage: image[1]}})
		})
	}
});