(function (){

	// Elements
	var $finishedUl = $('[data-finished]'), 
		$unfinishedUl = $('[data-unfinished]');

	// Get items
	var unfinishedName = 'unfinished',
		unfinishedItems = Cookies.get(unfinishedName),
		finishedName = 'finished',
		finishedItems = Cookies.get(finishedName);

	console.log(finishedItems);

	// Create array if not set, else parse it
	if (!unfinishedItems)
		unfinishedItems = [];
	else
		unfinishedItems = JSON.parse(unfinishedItems);
	if (!finishedItems)
		finishedItems = [];
	else
		finishedItems = JSON.parse(finishedItems);
	
	// Append an item
	function appendItem(ul, item, index){
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
	}

	// Append initial items
	unfinishedItems.forEach(function (item, index){
		appendItem($unfinishedUl, item, index);
	});
	finishedItems.forEach(function (item, index){
		appendItem($finishedUl, item, index);
	});

	// Render items to list
	function render() {
		// Render both UL:s
		console.log(unfinishedItems);
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

		// Validate
		if (!val)
			return false;

		// Get last index
		var lastIndex = unfinishedItems[unfinishedItems.length-1];
		if (lastIndex)
			lastIndex = lastIndex.index + 1;
		else
			lastIndex = 0;

		console.log(lastIndex);

		item.index = lastIndex;

		// Push
		unfinishedItems.push(item);
		Cookies.set(unfinishedName, unfinishedItems);

		// Append
		var $item = $('<li/>');
		$item.html('<span>' + item.text + '</span>');
		$item.attr({
			'data-index': item.index,
			'data-item': true
		});
		$item.addClass('unfinished');
		$unfinishedUl.prepend($item);

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
			$parent = $this.parent();

		// Check if item is in finished or unfinishedul
		if ($parent.data('unfinished')){
			// Get actual item index
			unfinishedItems.forEach(function (val){
				if (val.index == index)
					index = val.index;
			});

			// Check if item is finished or unfinished
			if ($this.hasClass('unfinished')){
				//alert("unfinished");
				unfinishedItems[index].finished = true;
				Cookies.set(unfinishedName, unfinishedItems);

				//render();
				$(this)
					.removeClass('unfinished')
					.addClass('finished');
			} else if ($this.hasClass('finished')) {
				//alert("finished");
				var item = unfinishedItems[index];
				unfinishedItems.splice(index, 1);
				finishedItems.push(item);

				Cookies.set(unfinishedName, unfinishedItems);
				Cookies.set(finishedName, finishedItems);

				//render();
				$this.remove();
				// Make append item instead.
			}
		} else if ($parent.data('finished')){
			// Remove it
			var $this = $(this),
				index = $this.data('index');
			finishedItems.splice(index, 1);
			Cookies.set(finishedName, finishedItems);

			render();
		}
	});

})($);