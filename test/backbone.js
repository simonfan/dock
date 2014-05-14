(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'dock',
		// dependencies for the test
		deps = [mod, 'should', 'backbone'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(dock, should, Backbone) {
	'use strict';

	describe('Create Backbone-specialized docks.', function () {
		beforeEach(function () {

			var modelDock = this.modelDock = dock.extend({
				afterAttach: function afterAttach(model, options) {

					this.listenTo(model, 'all', this.trigger);


					// trigger attach event.
					if (!options || !options.silent) {
						this.trigger('attach', model, options);
					}

				},

				afterDetach: function afterDetach(model, options) {

					this.stopListening(model);


					// trigger detach event.
					if (!options || !options.silent) {
						this.trigger('detach', model, options);
					}

				},
			});

			// events
			modelDock.assignProto(Backbone.Events);

			// proxies
			modelDock.defineProxies(['attributes']);



		});

		it('proxies properties', function () {

		});

		it('proxies events', function () {

			// models
			var banana = new Backbone.Model({
					name: 'banana',
					colors: ['yellow', 'green']
				}),
				apple = new Backbone.Model({
					name: 'apple',
					colors: ['red', 'green']
				});

			var mdock = this.modelDock();

			// var to hold event trigger count.
			var eventsControl = {
				attach: 0,
				detach: 0,
				change: 0,
			};

			////////////
			// listen //
			mdock.on('change', function (model) {

				// check type of model
				model.should.be.instanceof(Backbone.Model);

				eventsControl.change += 1;
			});

			mdock.on('attach', function (model) {
				model.should.be.instanceof(Backbone.Model);

				eventsControl.attach += 1;
			});
			mdock.on('detach', function (model) {
				model.should.be.instanceof(Backbone.Model);

				eventsControl.detach += 1;
			});
			// listen //
			////////////


			// attach
			mdock.attach(banana);
			eventsControl.attach.should.eql(1);

			// changes on model
			banana.set('format', 'moon');
			eventsControl.change.should.eql(1);
			banana.set('format', 'none');
			eventsControl.change.should.eql(2);

			// attach another model
			mdock.attach(apple);
			eventsControl.detach.should.eql(1);
			eventsControl.attach.should.eql(2);

			// change stuff on banana, the old model
			banana.set('colors', ['yellow', 'green', 'brown']);
			// check that no change was triggered on the model dock
			// and that the listener was set onto the model dock, not the banana model itself.
			eventsControl.change.should.eql(2);

			// change stuff on apple, the newly attached model
			apple.set('colors', ['yellow', 'green', 'red']);
			eventsControl.change.should.eql(3);


		});
	});
});
