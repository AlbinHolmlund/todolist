(function (){

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

			$this.css({
				top: curTop,
				left: left
			});
		});

		// Set list height
		$('[data-list]').each(function (){
			var $this = $(this),
				top = 0;

			$this.find('[data-item]').each(function (){
				top += $(this).outerHeight();
			});

			$this
				.css({
					height: top
				});
		});

	}, 1000/60);


})($);