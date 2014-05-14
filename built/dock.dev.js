//     dock
//     (c) simonfan
//     dock is licensed under the MIT terms.

/**
 * @module dock
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('dock',['require','exports','module','lodash','subject'],function (require, exports, module) {
	

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
	});

	// non writable and non enumerable properties
	dock.assignProto({

		/**
		 * If an attachment is passed in options hash,
		 * does the attaching.
		 *
		 * @method  initializeDock
		 * @param  {Object} options [description]
		 */
		initializeDock: function initializeDock(options) {

			if (options && options.attachment) {
				this.attach(options.attachment);
			}
		},

		/**
		 * Sequence for setting an attachment
		 * @method attach
		 * @param  {*} attachment [description]
		 * @param  {Object} options    [description]
		 * @return {this}            [description]
		 */
		attach: function attach(attachment, options) {

			// detach the current attachment
			this.detach(options);

			// hook: before attach.
			this.beforeAttach(attachment, options);

			// put attachment in place
			this.attachment = attachment;

			// hook: after attach.
			this.afterAttach(attachment, options);

			return this;
		},

		/**
		 * Logic for detaching the current attachment.
		 * Invokes hooks.
		 *
		 * @method detach
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		detach: function detach(options) {
			if (this.attachment) {

				var attachment = this.attachment;

				// hook: before detach.
				this.beforeDetach(attachment, options);

				// unset this.attachment
				delete this.attachment;

				// hook: after detach.
				this.afterDetach(attachment, options);
			}

			return this;
		},
	}, {
		writable: false,
		enumerable: false
	});


	// WRITABLE but NON-ENUMERABLE
	dock.assignProto({

		beforeAttach: _.noop,
		afterAttach: _.noop,

		beforeDetach: _.noop,
		afterDetach: _.noop,
	});

	// static
	dock.assignStatic({

		defineProxies: function defineProxies(properties) {

			// define proxy properties on this prototype
			this.assignProto(properties, {
				get: function getAttachmentValue(key) {

					var value = this.attachment[key];
					// if the value to be retrieved is a function
					// bind the fn to the attachment before returning it
					// to make sure the method, if executed, will be run
					// in the attachment's context.
					return (_.isFunction(value)) ? _.bind(value, this.attachment) : value;
				},
				set: function setAttachmentValue(key, value) {
					this.attachment[key] = value;
				}
			});

			return this;
		},

		extendProxies: function extendProxies(properties) {

			// create extended object
			var extended = this.extend();

			extended.defineProxies(properties);

			// return extended
			return extended;
		},
	});

/*
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

*/
});

