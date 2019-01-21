import componentSystem from '../../src/system'
import scrollTarget from '../../components/scroll-target'

document.addEventListener('DOMContentLoaded', e => {
	const system = componentSystem('component', [
		scrollTarget({
			onEnter(instance, direction) {

				if (instance.element.getAttribute('id') === 'section-5') {
					console.log('enter section-5', direction)
				}
			},
			onLeave(instance, direction) {
				if (instance.element.getAttribute('id') === 'section-5') {
					console.log('leave section-5', direction)
				}
			},
			onProgress(instance, progress, direction, previousProgress) {
				if (instance.element.getAttribute('id') === 'section-5') {
					console.log(progress)

					if (direction === 1) {
						console.log('forwards')
					} else if (direction === -1) {
						console.log('backwards')
					}
				}
			}
		})
	])

	system.initialize()
})
