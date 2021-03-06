(function (){

	// Init heights
	$('[data-item]').each(function (){
		var $this = $(this),
			$cont = $this.closest('ul'),
			startTop = $cont.offset().top,
			left = $cont.position().left,
			$prev = $this.prevUntil('ul');

		// Get top to move towards
		var top = startTop;
		$prev.each(function (){
			top += $(this).outerHeight();
		});

		$this.css({
			top: top,
			left: left
		});
	});

	// Set list height
	$('[data-list]').each(function (){
		var $this = $(this),
			height = 0;

		$this.find('[data-item]').each(function (){
			height += $(this).outerHeight();
		});

		$this
			.css({
				height: height
			});
	});

	// Update all items position at 60 fps
	setInterval(function (){

		$('[data-item]').each(function (){
			var $this = $(this),
				$cont = $this.closest('ul'),
				startTop = $cont.offset().top,
				left = $cont.position().left,
				$prev = $this.prevUntil('ul');

			// Get top to move towards
			var topTo = startTop;
			$prev.each(function (){
				topTo += $(this).outerHeight();
			});

			// Set new top
			var curTop = $this.position().top;
			curTop += (topTo - curTop) / 20;

			// Set width
			var width = $this.closest('ul').width();

			$this.css({
				top: curTop,
				left: left,
				width: width
			});
		});

		// Set list height
		$('[data-list]').each(function (){
			var $this = $(this),
				toHeight = 0,
				curHeight = $this.outerHeight();

			$this.find('[data-item]').each(function (){
				toHeight += $(this).outerHeight();
			});

			curHeight += (toHeight - curHeight) / 20;

			$this
				.css({
					height: curHeight
				});
		});

	}, 1000/60);


})($);