
(function($) {

	PollChange = {
		name: 'pollchange',

		createTypingTimeout: function(el, options) {

			var data = el.data(PollChange.name);

			if (data.timeoutId) {
				window.clearTimeout(data.timeoutId);
			}

			data.timeoutId = window.setTimeout(function() {
				el.trigger(PollChange.name);
			}, options.typingTimeout);
		},

		createPoll: function(el, options) {
			var oldval = el.val();
			
			el.data(PollChange.name, {
				intervalId : window.setInterval(function() {

					var data = el.data();
					if (!data.events || !data.events[PollChange.name] || data.events[PollChange.name].length == 0) {
						window.clearInterval(data[PollChange.name].intervalId);
						el.removeData(PollChange.name);
						return;
					}

					if (el.val() !== oldval) {
						if (options.typingTimeout == 0)
							el.trigger(PollChange.name);
						else
							PollChange.createTypingTimeout(el, options);
					}
					oldval = el.val();

				}, options.pollInterval)
			});
		}
	};

	$.fn.pollChange = function(callback, options) {

		if (typeof(callback) == 'undefined') {
			return this.trigger(PollChange.name);
		}
		
		var settings = {
			pollInterval: 500,
			typingTimeout: 500
		};

		return this.each(function() {
			if (options) {
				$.extend(settings, options);
			}

			var $this = $(this);

			$this.bind(PollChange.name, callback)
			if (!$this.data(PollChange.name)) {
				PollChange.createPoll($this, settings);
			}

		});

	};
})(jQuery);
