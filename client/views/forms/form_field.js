Template.formField.rendered = function(){
	$(this.firstNode).removeClass('off-page');
}

Template.formField.helpers({
	isTextArea: function(){
		if (this.type == 'textarea')
			return true
	}
})