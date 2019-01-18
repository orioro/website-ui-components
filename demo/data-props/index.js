import PropTypes from 'prop-types'

import { getElementProps } from '../../src/util'

document.addEventListener('DOMContentLoaded', e => {
	console.log(getElementProps(
		document.getElementById('sample-dialog'),
		{
			someString: PropTypes.string,
			someNumber: PropTypes.number,
		},
		'dialog'
	))

	// console.log(dataset(document.getElementById('sample-dialog')))
})
