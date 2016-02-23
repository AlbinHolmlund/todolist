(function (){

	$('[data-add-text').focus();

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
		var newItem = $('<li/>'),
			html = '<span>' + item.text + '</span>';
		html += '<input type="text" value="' + item.text + '"/>';
		newItem.append(html);
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
		var $item = $('<li/>'),
			html = '<span>' + item.text + '</span>';
		html += '<input type="text" value="' + item.text + '"/>'
		$item.html(html);
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


	// Right click event
    $('body').on("contextmenu", "[data-item]", function(e){
        e.preventDefault();

		var $this = $(this),
			index = $this.data('index'),
			$parent = $this.parent();

		// Get actual item index
		var item = null;
		items.forEach(function (val, i){
			if (val.index == index){
				item = val;
			}
		});

		// Check if item is in finished or unfinishedul
		if ($parent.data('unfinished')){
			// Check if item is finished or unfinished
			if ($this.hasClass('finished')){
				item.finished = false;
				Cookies.set(cookieName, items);

				$(this)
					.removeClass('finished')
					.addClass('unfinished');
			}
		} else if ($parent.data('finished')){
			item.finished = false;
			item.inFinishedUl = false;
			Cookies.set(cookieName, items);
			var $item = $this;
			$this
				.removeClass('finished')
				.addClass('unfinished');
			$this.remove();
			$unfinishedUl.append($item);
		}
    });

	// Item events
	$('body').on('click', '[data-item]:not(.edit)', function (){
	    var $button = $(this);
	    if ($button.data('alreadyclicked')){
	        $button.data('alreadyclicked', false); // reset
	        if ($button.data('alreadyclickedTimeout')){
	            clearTimeout($button.data('alreadyclickedTimeout')); // prevent this from happening
	        }
	        // do what needs to happen on double click. 
	        /* HERE */

	        $button.addClass('edit');
	        $button.find('input').focus();

	    } else {
	        $button.data('alreadyclicked', true);
	        var alreadyclickedTimeout = setTimeout(function(){
	            $button.data('alreadyclicked', false); // reset when it happens
	            // do what needs to happen on single click. 

	            /* HERE */
				var $this = $button,
					index = $this.data('index'),
					arrayIndex = null,
					$parent = $this.parent();

				// Get actual item index
				var item = null;
				items.forEach(function (val, i){
					if (val.index == index){
						item = val;
						arrayIndex = i;
					}
				});

				// Check if item is in finished or unfinishedul
				if ($parent.data('unfinished')){
					// Error
					if (item === null)
						alert("Wtf? Why is it null");

					// Check if item is finished or unfinished
					if ($this.hasClass('unfinished')){
						// Set state to finished
						item.finished = true;
						Cookies.set(cookieName, items);

						$this
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
					items.splice(arrayIndex, 1);
					Cookies.set(cookieName, items);

					$this.remove();
				}

	            // use el instead of $(this) because $(this) is 
	            // no longer the element
	        },300); // <-- dblclick tolerance here
	        $button.data('alreadyclickedTimeout', alreadyclickedTimeout); // store this id to clear if necessary
	    }
	    return false;
	});

	// Edit input finished
	$('body').on('keydown', '[data-item] input', function (e){
	    if(e.which === 13) {
	    	var $this = $(this),
	    		val = $this.val(),
	    		$li = $this.closest('li'),
	    		index = $li.data('index'),
				arrayIndex = null;

			// Get actual item index
			var item = null;
			items.forEach(function (val, i){
				if (val.index == index){
					item = val;
					arrayIndex = i;
				}
			});

			// Update item
			item.text = val;
			Cookies.set(cookieName, items);

			$li.removeClass('edit');
			$li.find('span').text(val);
	    }
	});

})($);