//create local Meteor collection (client-only) to store errors
Errors = new Meteor.Collection(null);

throwError = function(message, type){
	Errors.insert({message: message, type: type, seen: false})
}

clearErrors = function(){
	Errors.remove({seen:true});
}

Template.errors.helpers({
	errors: function(){
		return Errors.find();
	}
});

Template.error.rendered = function(){
	$('.content').addClass('with-errors');
	var error = this.data;
	Meteor.defer(function(){
		Errors.update(error._id, {$set: {seen: true}});
	});

	setTimeout(function(){
		$('.alert-error').fadeOut(1500);
	}, 1500);

	setTimeout(function(){
		$('.content').removeClass('with-errors');
	}, 2700);
}

Template.error.events({
	'click .close-btn': function(e){
		$('.content').removeClass('with-errors');	
		$(e.target).parent('.alert-error').remove();
	}
});