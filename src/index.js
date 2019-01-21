import system from './system'
import dialog from '../components/dialog'
import tabs from '../components/tabs'
import trigger from '../components/trigger'
import scrollTarget from '../components/scroll-target'

const createSystem = (namespace = 'component', components) => {
	return componentSystem(namespace, [
		dialog(),
		tabs(),
		trigger(),
		scrollTarget(),
		...components,
	])
}

export default createSystem
