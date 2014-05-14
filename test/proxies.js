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

	describe('dock proxies', function () {
		beforeEach(function (done) {
			done();
		});

		it('proxies properties', function () {

			var someObj1 = {
					attributes: {
						first: 'obj1-first',
						second: 'obj1-second',
					},

					id: 'qwerty',
				},
				someObj2 = {
					id: 'asdfgh',

					attributes: {
						first: 'obj2-first',
						second: 'obj2-second',
					},
				};

			var objectDockConstructor = dock.extendProxies(['attributes']);



			// initialize with attachment
			var objectDock = objectDockConstructor({
				attachment: someObj1
			});
			// check the proxy access
			objectDock.attributes.should.eql({
				first: 'obj1-first',
				second: 'obj1-second',
			});


			// attach another object
			objectDock.attach(someObj2);

			// check proxy access
			objectDock.attributes.should.eql({
				first: 'obj2-first',
				second: 'obj2-second'
			});




		});

		it('proxies methods', function () {

			var proto = {

				// this method sets a property of itself.
				setProperty: function setProperty(key, value) {
					this[key] = value;
				},
			};

			var obj1 = _.create(proto),
				obj2 = _.create(proto);

			var objectDockConstructor = dock.extendProxies(['setProperty']);

			// instantiate dock
			var objectDock = objectDockConstructor({ attachment: obj1 });


			// call method
			objectDock.setProperty('someprop', 'somevalue-1');

			// the setProperty should not have set the property
			// directly on the dock, but on the object itself.
			objectDock.attachment.someprop.should.eql('somevalue-1');
			obj1.someprop.should.eql('somevalue-1');
			objectDock.should.not.have.property('someprop');

			// detach and attach another guy
			objectDock.attach(obj2);
			objectDock.setProperty('someprop', 'somevalue-2');

			objectDock.attachment.someprop.should.eql('somevalue-2');
			// obj1 remains unchanged
			obj1.someprop.should.eql('somevalue-1');
			// obj2 is changed.
			obj2.someprop.should.eql('somevalue-2');
			// objectDock continues without the property.
			objectDock.should.not.have.property('someprop');
		});

	});
});
