Template.notFound.rendered = function(){
	var counter = 0;
	var emojis = $('.sad-emoji');

	var interval = Meteor.setInterval(function () {
		counter++;
		console.log('hi');
		if ($('.not-found-section').length){

			$(emojis[counter - 1]).removeClass('off-page');

			// end of game
			if (counter === emojis.length + 1) {
				$('.sad-emoji').addClass('off-page');
				counter = 0;
			}
		} else {
			Meteor.clearInterval(interval);
		}
	}, 600);
}

Template.notFound.helpers({
	sadEmojis: function(){
		return [
			":no_mouth:",
			":neutral_face:",
			":confused:",
			":frowning:",
			":fearful:",
			":anguished:",
			":tired_face:",
			":sob:",
			":dizzy_face:",
			":fire:"
		]
	}
})