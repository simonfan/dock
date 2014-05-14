//     dock
//     (c) simonfan
//     dock is licensed under the MIT terms.

define("dock",["require","exports","module","lodash","subject"],function(t,e,i){var a=t("lodash"),n=t("subject"),h=i.exports=n({initialize:function(t){this.initializeDock(t)}});h.assignProto({initializeDock:function(t){t&&t[this.attachmentAttribute]&&this.attach(t[this.attachmentAttribute])},attach:function(t,e){return this.detach(e),this.beforeAttach(t,e),this[this.attachmentAttribute]=t,this.afterAttach(t,e),this},detach:function(t){if(this.attachment){var e=this.attachment;this.beforeDetach(e,t),delete this[this.attachmentAttribute],this.afterDetach(e,t)}return this}},{writable:!1,enumerable:!1}),h.assignProto({attachmentAttribute:"attachment",beforeAttach:a.noop,afterAttach:a.noop,beforeDetach:a.noop,afterDetach:a.noop}),h.assignStatic({defineProxies:function(t){return this.assignProto(t,{get:function(t){var e=this[this.attachmentAttribute],i=e[t];return a.isFunction(i)?a.bind(i,e):i},set:function(t,e){this[this.attachmentAttribute][t]=e}}),this},extendProxies:function(t){var e=this.extend();return e.defineProxies(t),e}})});