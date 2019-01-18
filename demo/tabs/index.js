import componentSystem from '../../src/system'
import tabs from '../../components/tabs'
import trigger from '../../components/trigger'

document.addEventListener('DOMContentLoaded', e => {
	const system = componentSystem('component', [
		tabs(),
		trigger()
	])

	system.initialize()
})
