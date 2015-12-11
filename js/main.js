(function (){

	// Elements
	var $finishedUl = $('[data-finished]'), 
		$unfinishedUl = $('[data-unfinished]');

	// Get items
	var unfinishedName = 'unfinished',
		unfinishedItems = Cookies.get(unfinishedName),
		finishedName = 'finished',
		finishedItems = Cookies.get(finishedName);

	// Create array if not set, else parse it
	if (!unfinishedItems)
		unfinishedItems = [];
	else
		unfinishedItems = JSON.parse(unfinishedItems);
	if (!finishedItems)
		finishedItems = [];
	else
		finishedItems = JSON.parse(finishedItems);

	
	// Add stored items
	function appendItems(ul, items){
		ul.html('');
		items.forEach(function (item, index){
			var newItem = $('<li/>');
			newItem.append('<span>' + item.text + '</span>');
			newItem.attr('data-index', index);
			newItem.attr('data-item', true);

			// Finished or not
			if (item.finished)
				newItem.addClass('finished');
			else
				newItem.addClass('unfinished');

			// Prepend it
			ul.prepend(newItem);
		});
	}

	// Render items to list
	function render() {
		// Render both UL:s
		appendItems($unfinishedUl, unfinishedItems);
		appendItems($finishedUl, finishedItems);
	}
	render();

	/*** Actions ***/

	// Add item
	function addItem(){
		var $addInput = $('[data-add-text]'),
			val = $addInput.val(),
			item = {
				finished: false,
				text: val
			};

		// Push
		unfinishedItems.push(item);
		Cookies.set(unfinishedName, unfinishedItems);

		// Append
		var index = unfinishedItems.length - 1;

		// Render
		render();

		// Clear input
		$addInput.val('');
	}
	$('[data-add]').click(function (){
		addItem();
	});
	$('[data-add-text]').on('keydown', function(ev) {
	    if(ev.which === 13) {
	    	addItem();
	    }
	});

	// Remove item
	$('body').on('click', '[data-item]', function (){
		var $this = $(this),
			index = $this.data('index'),
			$parent = $this.parent();;

		// Check if item is in finished or unfinishedul
		if ($parent.data('unfinished')){
			// Check if item is finished or unfinished
			if ($this.hasClass('unfinished')){
				//alert("unfinished");
				unfinishedItems[index].finished = true;
				Cookies.set(unfinishedName, unfinishedItems);
				appendItems($unfinishedUl, unfinishedItems);
			} else if ($this.hasClass('finished')) {
				//alert("finished");
				var item = unfinishedItems[index];
				unfinishedItems.splice(index, 1);
				finishedItems.push(item);

				Cookies.set(unfinishedName, unfinishedItems);

				render();
			}
		} else if ($parent.data('finished')){

		}
	});

})($);