//     dock
//     (c) simonfan
//     dock is licensed under the MIT terms.

/**
 * @module dock
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash'),
		subject = require('subject');





	/**
	 * The constructor for the dock object.
	 *
	 * @method dock
	 * @constructor
	 * @param options
	 *     @param [attachment] {Object}
	 *         Optionally provide a attachment that will initially fill the $el.
	 */
	var dock = module.exports = subject({
		initialize: function initialize(options) {
			this.initializeDock(options);
		},

		initializeDock: function initializeDock(options) {

			if (options && options.attachment) {
				this.attach(options.attachment);
			}
		},

		trigger: function trigger(event) {

			this.attachment.trigger.apply(this, arguments);

		},

		listenTo: function listenTo(object, event, callback) {
			object.on(event, callback);
		},

		stopListening: function stopListening(object, event) {
			object.off(event);
		},

		events: '',

		/**
		 *
		 *
		 *
		 * @method invoke
		 * @param method
		 * @params [arguments]
		 */
		invoke: function invoke(method) {
			if (this.attachment) {

				var args = Array.prototype.slice.call(arguments, 1);

				return this.attachment[method].apply(this.attachment, args);

			} else {
				throw new Error('No attachment attached to dock. Unable to invoke ' + method);
			}
		},


		retrieve: function retrieve(property) {
			if (this.attachment) {

				return this.attachment[property];

			} else {
				throw new Error('No attachment attached to dock. Unable to retrieve ' + property);
			}
		},


		/**
		 *
		 *
		 *
		 */
		attach: function attach(attachment, options) {

			this.detach();

			this.attachment = attachment;

			this.listenTo(attachment, this.events, this.trigger);

			// trigger attach event.
			if (!options || !options.silent) {
				this.trigger('attach', attachment);
			}

			return this;
		},

		/**
		 *
		 *
		 * @method detach
		 */
		detach: function detach(options) {
			if (this.attachment) {

				var attachment = this.attachment;

				// Stop listening to all events from the attachment.
				this.stopListening(attachment);

				// unset this.attachment
				delete this.attachment;

				// trigger detach event
				if (!options || !options.silent) {
					this.trigger('detach', attachment);
				}
			}

			return this;
		},
	});


	// static methods
	dock.extendProxyMethods = function extendProxyMethods(methodNames) {


		// object to hold the methods
		var methods = {};

		_.each(methodNames, function (method) {
			methods[method] = _.partial(dock.prototype.invoke, method);
		});

		// create an extended dock
		return this.extend(methods);
	};

	dock.extendRetrievalMethods = function extendRetrievalMethods(propertyNames) {
		var methods = {};

		_.each(propertyNames, function (property) {
			methods[property] = _.partial(dock.prototype.retrieve, property);
		});

		return this.extend(methods);
	};



	// model dock
	var modelDock = dock
		// the proxy methods for model
		.extendProxyMethods([
			'get', 'set', 'escape', 'has', 'unset', 'clear',
			'toJSON',
			'sync', 'fetch', 'save', 'destroy',
			'keys', 'values', 'pairs', 'invert', 'pick', 'omit',
			'validate', 'isValid',
			'url',
			'parse',
			'clone', 'isNew',
			'hasChanged', 'changedAttributes',
			'previous', 'previousAttributes'
		])
		// the retrieval methods for model
		.extendRetrievalMethods([
			'id', 'idAttribute', 'cid', 'attributes',
			'changed', 'defaults',
			'validationError',
			'urlRoot',
		]);

	dock.model = modelDock;

	// collection dock
	var collectionDock = dock
		// the proxy methods for collection
		.extendProxyMethods([

		])
		.extendRetrievalMethods([

		]);

	dock.collection = collectionDock;
});
