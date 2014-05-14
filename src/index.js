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

			if (options && options[this.attachmentAttribute]) {
				this.attach(options[this.attachmentAttribute]);
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
			this[this.attachmentAttribute] = attachment;

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

			var attachment = this[this.attachmentAttribute];

			if (attachment) {

				// hook: before detach.
				this.beforeDetach(attachment, options);

				// unset this.attachment
				delete this[this.attachmentAttribute];

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

		/**
		 * The attribute to which the attached object will be saved.
		 *
		 * @property attachmentAttribute
		 * @type {String}
		 */
		attachmentAttribute: 'attachment',

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

					var attachment = this[this.attachmentAttribute],
						value      = attachment[key];
					// if the value to be retrieved is a function
					// bind the fn to the attachment before returning it
					// to make sure the method, if executed, will be run
					// in the attachment's context.
					return (_.isFunction(value)) ? _.bind(value, attachment) : value;
				},
				set: function setAttachmentValue(key, value) {
					this[this.attachmentAttribute][key] = value;
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
});
