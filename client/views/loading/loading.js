Template.loading.rendered = function(){
	var counter = 0;
	var emojis = $('.emoji');

	var interval = Meteor.setInterval(function () {
		counter++;
		console.log('hi');
		if ($('.loading-wrapper').length){

			$(emojis[counter - 1]).removeClass('off-page');

			// end of game
			if (counter === emojis.length) {
				$('.emoji').addClass('off-page');
				counter = 0;
			}
		} else {
			Meteor.clearInterval(interval);
		}
	}, 300);
}

Template.loading.helpers({
	randomEmojis: function(){
		var emojis = _.map(_.sample(_.filter(Meteor.emojis(), function(emoji){
			return _.indexOf(['places', 'other'], emoji.category) == -1; 
		}), 6), 
		function(emoji){
			return {shortname: emoji.shortname, category: emoji.category};
		});

		return emojis;
	}
})