import '../polyfills'
import delegate from 'delegate'
import EventEmitter from 'events'
import closest from 'element-closest'

import {
	initializeHashNavigationTracking
} from './navigation'
import {
	validateComponentSpec,
	instantiateComponents,
} from './component'

import {
	getUrlHash,
	getTargetElementGivenUrl,
	attributeSelector,
} from '../util'

const DOM_ATTRIBUTE_ALLOWED_CHARS_RE = /^[a-z\-]+$/

const isValidAttributeName = str => DOM_ATTRIBUTE_ALLOWED_CHARS_RE.test(str)

const validateNamespace = namespace => {
	if (!isValidAttributeName(namespace)) {
		throw new Error(`Invalid namespace ${namespace}`)
	}
}

class ComponentSystem extends EventEmitter {
	constructor(namespace, specs = []) {
		super()

		validateNamespace(namespace)
		specs.forEach(validateComponentSpec)

		this.rootElement = null
		this.namespace = namespace
		this.componentDataAttribute = `data-${namespace}`
		this.triggerDataAttribute = `data-${namespace}-trigger`

		this.specs = specs
		this.instances = null

		this.ready = false

		// Bind methods
		this.navHandleNavigation = this.navHandleNavigation.bind(this)
	}

	/**
	 * Initializes the component system within the
	 * given rootNode
	 * @param  {DOMElement} rootElement
	 */
	initialize(rootElement = document, { enableHashNavigationTracking = true } = {}) {

		/**
		 * Loop through specs, initialize them
		 */
		this.specs = this.specs.map(spec => {
			if (typeof spec.initialize === 'function') {
				spec.initialize(this)
			}

			return {
				initialized: true,
				...spec,
			}
		})

		this.rootElement = rootElement
		this.instances = instantiateComponents(this, rootElement, this.componentDataAttribute)
		
		if (enableHashNavigationTracking) {
			initializeHashNavigationTracking(this, rootElement)
		}

		this.ready = true
		this.emit('ready')
	}

	/**
	 * Handles navigations
	 */
	navHandleNavigation(targetUrl) {
		const targetElement = getTargetElementGivenUrl(targetUrl)
		return targetElement ?
			this.invoke(targetElement, null, 'defaultAction') : false
	}

	/**
	 * Official way of pushing to window.history through the component system
	 * @param  {String} url      [description]
	 * @param  {String} title    [description]
	 * @param  {Object} stateObj [description]
	 */
	navHistoryPushState(url, stateObj = {}, title = '') {
		stateObj = {
			...stateObj,
			isSynthetic: true,
			historyLength: window.history.length,
		}

		return window.history.pushState(stateObj, title, url)
	}

	/**
	 * Official way of replacing current history state through the component system
	 * @param  {String} url      [description]
	 * @param  {String} title    [description]
	 * @param  {Object} stateObj [description]
	 */
	navHistoryReplaceState(url, stateObj = {}, title = '') {
		stateObj = {
			...stateObj,
			isSynthetic: true,
			historyLength: window.history.length,
		}

		return window.history.replaceState(stateObj, title, url)
	}

	/**
	 * Retrieves current hash of the url
	 * @return {String}
	 */
	navHistoryGetCurrentHash() {
		return getUrlHash(window.location.href)
	}

	/**
	 * Retrieves a registered component spec
	 * @param  {String} componentName
	 * @return {Object}
	 */
	getComponentSpec(componentName) {
		return this.specs.find(spec => spec.componentName === componentName) || null
	}

	/**
	 * Retrieves an array of instances of a given component
	 * @param  {String} componentName
	 * @return {Array}
	 */
	getComponentInstances(componentName) {
		return this.instances.filter(instance => instance.spec.componentName === componentName)
	}

	/**
	 * Retrieves the component instance that corresponds to the
	 * given element
	 */
	getComponentInstanceByElement(element) {
		return this.instances.find(instance => instance.element === element) || null
	}

	/**
	 * Retrieves the closest ancestor component instance
	 * relative to the given element
	 */
	getClosestComponentInstance(element, componentName = null) {
		const selector = attributeSelector(this.componentDataAttribute, componentName)
		const closestComponentRoot = element.closest(selector)

		return closestComponentRoot ?
			this.getComponentInstanceByElement(closestComponentRoot) :
			null
	}

	/**
	 * Invokes a method for the given target's closest component.
	 * 
	 * @param  {[type]} targetElement [description]
	 * @param  {[type]} componentName [description]
	 * @param  {String} actionName    [description]
	 * @param  {Array}  actionArgs    [description]
	 * @return {[type]}               [description]
	 */
	invoke(targetElement, componentName, actionName = 'defaultAction', actionArgs = []) {
		const instance = this.getClosestComponentInstance(targetElement, componentName)
		let handled = false

		if (instance) {
			const actionFn = instance[actionName]

			if (typeof actionFn === 'function') {
				/**
				 * Default action receives the targetElement as the first argument
				 */
				actionArgs = actionName === 'defaultAction' ? [targetElement, ...actionArgs] : actionArgs
				actionFn.apply(null, actionArgs)
				handled = true
			} else {
				console.warn(`Invalid action: '${instance.spec.componentName}' '${actionName}'`)
			}
		}

		return handled
	}
}

export default (namespace, specs) => {
	return new ComponentSystem(namespace, specs)
}
