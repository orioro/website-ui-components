import camelcase from 'camelcase'
import decamelize from 'decamelize'
import PropTypes from 'prop-types'

export const coerceValue = (targetPropType, value) => {
	switch (targetPropType) {
		case PropTypes.array:
		case PropTypes.array.isRequired:
			return value ? JSON.parse(value) : undefined
		case PropTypes.bool:
		case PropTypes.bool.isRequired:
			return Boolean(value)
		case PropTypes.func:
		case PropTypes.func.isRequired:
			throw new Error('Invalid PropType: func is not supported')
			break
		case PropTypes.number:
		case PropTypes.number.isRequired:
			return value ? Number(value) : value
		case PropTypes.object:
		case PropTypes.object.isRequired:
			return value ? JSON.parse(value) : undefined
		case PropTypes.symbol:
		case PropTypes.symbol.isRequired:
			throw new Error('Invalid PropType: symbol is not supported')
			break
		case PropTypes.string:
		case PropTypes.string.isRequired:
		default:
			return value
	}
}

export const getElementProps = (element, elementPropTypes, namespace, validate = true) => {
	const props = Object.keys(elementPropTypes).reduce((acc, property) => {
		const targetPropType = elementPropTypes[property]
		return {
			...acc,
			[property]: coerceValue(
				targetPropType,
				getElementDataProperty(element, targetPropType, property, namespace)
			)
		}
	}, {})

	if (validate) {
		PropTypes.checkPropTypes(elementPropTypes, props, 'prop', namespace)
	}

	return props
}

const convertToDataAttributeName = (property, namespace = null)  => {
	return namespace ? 
		`data-${decamelize(namespace, '-')}-${decamelize(property, '-')}` :
		`data-${decamelize(property, '-')}`
}

const getElementDataProperty = (element, targetPropType, property, namespace = null) => {
	if (targetPropType === PropTypes.bool ||
			targetPropType === PropTypes.bool.isRequired) {
		// Boolean
		return element.hasAttribute(convertToDataAttributeName(property, namespace))
	} else {
		return element.dataset ?
			element.dataset[namespace ? camelcase(`${namespace}-${property}`) : property] :
			element.getAttribute(convertToDataAttributeName(property, namespace))
	}
}
