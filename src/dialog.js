import delegate from 'delegate'
import PropTypes from 'prop-types'

const dialog = (system, componentRoot, props) => {
	console.log(system, componentRoot, props)

	return {
		handleActivation: (activationTarget) => {

		},
	}
}

dialog.componentName = 'dialog'

dialog.propTypes = {
	someString: PropTypes.string,
	someNumber: PropTypes.number,
	someBoolean: PropTypes.bool,
	someOtherBoolean: PropTypes.bool.isRequired,
	someArray: PropTypes.array,
	someRequiredNumber: PropTypes.number.isRequired,
	someJson: PropTypes.object,
}

export default dialog
