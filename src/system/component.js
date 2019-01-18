import PropTypes from 'prop-types'
import delegate from 'delegate'

import {
	getElementProps,
	attributeSelector
} from '../util'

export const validateComponentSpec = spec => {
	if (!spec.componentName) {
		throw new Error('spec.componentName name must be defined.')
	}

	if (typeof spec.createInstance !== 'function') {
		throw new Error('spec.createInstance must be either a function or have a `instantiate` function')
	}
}

export const validateComponentInstance = instance => {
	if (typeof instance.defaultAction !== 'function') {
		throw new Error(`${instance.spec.componentName} instance has no defaultAction name`)
	}
}

export const createComponentInstance = (system, spec, element) => {
	const instance = {
		...spec.createInstance(
			system,
			element,
			spec.instancePropTypes ? getElementProps(element, spec.instancePropTypes, spec.componentName) : {}
		),
		spec,
		element
	}

	validateComponentInstance(instance)

	return instance
}

export const instantiateComponents = (system, rootElement, componentDataAttribute) => {
	return Array.from(rootElement.querySelectorAll(attributeSelector(componentDataAttribute)))
		.map(element => {
			const componentName = element.getAttribute(componentDataAttribute)
			const spec = system.getComponentSpec(componentName)

			if (!spec) {
				console.warn(`Component spec not defined: ${componentName}`)
				return null
			}

			return createComponentInstance(system, spec, element)
		})
		.filter(Boolean)
}
