import delegate from 'delegate'
import PropTypes from 'prop-types'

const DIALOG_COMPONENT_NAME = 'dialog'

const dialog = (system, componentRoot, {
	activeClass = 'active'
} = {}) => {

	const open = () => {
		componentRoot.classList.add(activeClass)
	}

	const close = () => {
		componentRoot.classList.remove(activeClass)
	}

	const dismiss = ({ delay }) => {
		console.log(delay)
		close()
	}

	dismiss.propTypes = {
		delay: PropTypes.number,
	}

	const handleActivation = () => {
		system.getComponentInstances(DIALOG_COMPONENT_NAME).forEach(instance => {
			instance.close()
		})

		open()
	}

	return {
		open,
		close,
		dismiss,
		handleActivation
	}
}

dialog.componentName = DIALOG_COMPONENT_NAME
dialog.propTypes = {
	activeClass: PropTypes.string,
}

export default dialog
