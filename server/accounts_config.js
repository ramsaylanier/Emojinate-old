Accounts.config(function(){
	
})

Accounts.onCreateUser(function(options, user){
	if (options.profile)
		user.username = options.profile.name;

	return user;
})