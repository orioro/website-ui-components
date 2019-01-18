export * from './element-props'
export * from './scroll'
export * from './url-selection'

export const attributeSelector = (attributeName, attributeValue) => {
	return attributeName && attributeValue ?
		`[${attributeName}="${attributeValue}"]` :
		`[${attributeName}]`
}

export const getElementsArray = (selector, rootElement = document) => {
	return Array.from(rootElement.querySelectorAll(selector))
}
