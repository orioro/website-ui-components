import '../polyfills'
import delegate from 'delegate'
import EventEmitter from 'events'
import closest from 'element-closest'
import decamelize from 'decamelize'

import { getElementProps } from '../util'

import { getTargetElementGivenUrl } from './navigation'

const validateComponentSpec = spec => {
	if (!spec.componentName) {
		throw new Error('ComponentSpec name must be defined.')
	}

	if (typeof spec !== 'function' && typeof spec.instantiate !== 'function') {
		throw new Error('ComponentSpec must be either a function or have a `instantiate` function')
	}
}

const instantiateComponent = (spec, system, element) => {
	const instance = {
		...spec(
			system,
			element,
			spec.propTypes ? getElementProps(element, spec.propTypes, spec.componentName) : {}
		),
		spec,
		element
	}

	if (typeof instance.handleActivation !== 'function') {
		throw new Error(`${spec.componentName} instance has no handleActivation name`)
	}

	/**
	 * Listen to action triggers within the component
	 */
	const componentActionDataAttribute = `data-${spec.componentName}-action`
	delegate(element, `[${componentActionDataAttribute}]`, 'click', e => {
		const triggerElement = e.delegateTarget
		const actionName = triggerElement.getAttribute(componentActionDataAttribute)
		const actionFn = instance[actionName]

		if (typeof actionFn === 'function') {
			const actionProps = typeof actionFn.propTypes === 'object' ? getElementProps(
				triggerElement,
				actionFn.propTypes,
				`${spec.componentName}-action-${actionName}`
			) : {}

			actionFn(actionProps)
		} else {
			console.warn(`Undefined action: ${spec.componentName} - ${actionName}`)
		}
	})

	return instance
}

class ComponentSystem extends EventEmitter {
	constructor(dataAttribute, specs = []) {
		super()

		if (!dataAttribute) {
			throw new Error('dataAttribute is required')
		}

		if (!dataAttribute.startsWith('data-')) {
			throw new Error('dataAttribute must use data- prefix')
		}

		this.rootElement = null
		this.dataAttribute = dataAttribute
		this.allComponentsSelector = `[${this.dataAttribute}]`
		this.specs = specs
		this.instances = null

		this.specs.forEach(validateComponentSpec)

		this.ready = false
	}

	/**
	 * Initializes the component system within the
	 * given rootNode
	 * @param  {DOMElement} rootElement
	 */
	initialize(rootElement = document, { enableHashNavigationTracking = true } = {}) {
		this.rootElement = rootElement

		this.instances = Array.from(
			rootElement.querySelectorAll(this.allComponentsSelector)
		)
		.map(element => {
			const spec = this.getComponentSpec(element.getAttribute(this.dataAttribute))

			if (!spec) {
				console.warn(`Component spec not defined: ${spec}`)
				return null
			}

			return instantiateComponent(spec, this, element)
		})
		.filter(Boolean)

		if (enableHashNavigationTracking) {
			this.trackHashNavigation()
		}

		this.ready = true
		this.emit('system-ready')
	}

	trackHashNavigation() {
		delegate(this.rootElement, 'a', 'click', e => {
			e.preventDefault()

			const targetHref = e.delegateTarget.getAttribute('href')
			const targetElement = getTargetElementGivenUrl(targetHref)

			if (targetElement) {
				this.handleActivation(targetElement)
			}
		})
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

	getClosestComponentInstance(element, componentName = null) {
		const selector = componentName ?
			`[${this.dataAttribute}="${componentName}"]` :
			this.allComponentsSelector
		const closestComponentRoot = element.closest(selector)

		return closestComponentRoot ?
			this.getComponentInstanceByElement(closestComponentRoot) :
			null
	}

	/**
	 * Attempts to handleActivation the closest component to the targetElement
	 * @param  {DOMElement} targetElement
	 * @param  {String}     componentName
	 * @param  {...} args
	 * @return {Promise}
	 */
	handleActivation(
		targetElement,
		componentName = null,
		...args
	) {
		const instance = this.getComponentInstanceByElement(targetElement, componentName)
		let handled = false

		if (instance) {
			handled = instance.handleActivation(targetElement, ...args) ? true : false
		}

		return handled
	}
}

export default (dataAttribute, specs) => {
	return new ComponentSystem(dataAttribute, specs)
}
