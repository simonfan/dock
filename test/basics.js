(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'dock',
		// dependencies for the test
		deps = [mod, 'should', 'lodash'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(dock, should, _) {
	'use strict';

	describe('dock basics', function () {
		beforeEach(function (done) {
			done();
		});

		it('runs hooks', function () {


			// variable to assert the hooks were called
			var hookControl = {
				beforeAttach: 0,
				afterAttach: 0,
				beforeDetach: 0,
				afterDetach: 0,
			};

			var objDock = dock.extend({
				beforeAttach: function (object, options) {
					hookControl.beforeAttach += 1;
				},

				afterAttach: function (object, options) {
					this.attachment.should.be.type('object');
					hookControl.afterAttach += 1;
				},

				beforeDetach: function () {
					hookControl.beforeDetach += 1;
				},

				afterDetach: function () {
					hookControl.afterDetach += 1;
				}
			});


			var o = objDock();

			o.attach({ id: '1' });

			hookControl.should.eql({
				beforeAttach: 1,
				afterAttach: 1,
				beforeDetach: 0,
				afterDetach: 0,
			});

			o.attach({ id: '2' });

			hookControl.should.eql({
				beforeAttach: 2,
				afterAttach: 2,
				beforeDetach: 1,
				afterDetach: 1,
			});
		})
	});
});
