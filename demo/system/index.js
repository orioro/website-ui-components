import componentSystem from '../../src/system'
import dialog from '../../src/dialog'

document.addEventListener('DOMContentLoaded', e => {
	const system = componentSystem('data-component', [
		dialog,
	])

	system.initialize()
})
