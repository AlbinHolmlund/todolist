(function (){

	// Elements
	var $finishedUl = $('[data-finished]'), 
		$unfinishedUl = $('[data-unfinished]');

	// Get items
	var cookieName = 'todo-items',
		items = Cookies.get(cookieName);

	// Create array if not set, else parse it
	if (!items)
		items = [];
	else
		items = JSON.parse(items);

	// Get finished and unfinished items
	var unfinishedItems = items.filter(function (val){
		return val.inFinishedUl === false;
	});
	var finishedItems = items.filter(function (val){
		return val.inFinishedUl === true;
	});
	console.dir(items);
	
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
	unfinishedItems.forEach(function (item){
		appendItem($unfinishedUl, item, item.index);
	});
	finishedItems.forEach(function (item){
		appendItem($finishedUl, item, item.index);
	});

	/*** Actions ***/

	// Add item
	function addItem(){
		// Get last index
		var indexes = [];
		items.forEach(function (val){
			indexes.push(val.index);
		});
		var highestIndex = Math.max.apply(null, indexes),
			newIndex = indexes.length > 0 ? highestIndex + 1 : 0;

		// Vars
		var $addInput = $('[data-add-text]'),
			val = $addInput.val(),
			item = {
				finished: false,
				inFinishedUl: false,
				text: val,
				index: newIndex
			};

		// Validate
		if (!val)
			return false;

		// Push
		items.push(item);
		Cookies.set(cookieName, items);

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
			var item = null;
			items.forEach(function (val){
				if (val.index == index)
					item = val;
			});

			// Error
			if (item === null)
				alert("Wtf? Why is it null");

			// Check if item is finished or unfinished
			if ($this.hasClass('unfinished')){
				// Set state to finished
				item.finished = true;
				Cookies.set(cookieName, items);

				$(this)
					.removeClass('unfinished')
					.addClass('finished');
			} else if ($this.hasClass('finished')) {
				// Add to finished ul
				item.inFinishedUl = true;
				Cookies.set(cookieName, items);

				console.log(item);

				var $item = $this;
				$this.remove();
				$finishedUl.prepend($item);
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