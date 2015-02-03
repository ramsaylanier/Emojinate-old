Accounts.config(function(){
	
})

Accounts.onCreateUser(function(options, user){
	if (options.profile)
		console.log(user);
		user.username = user.services.twitter.screenName;

	return user;
})