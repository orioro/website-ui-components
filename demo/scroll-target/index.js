import componentSystem from '../../src/system'
import scrollTarget from '../../components/scroll-target'

document.addEventListener('DOMContentLoaded', e => {
	const system = componentSystem('component', [
		scrollTarget({
			onEnter(instance) {
				if (instance.element.getAttribute('id') === 'section-5') {
					console.log('enter section-5')
				}
			},
			onLeave(instance) {
				if (instance.element.getAttribute('id') === 'section-5') {
					console.log('leave section-5')
				}
			},
			onProgress(instance, progress, previousProgress) {
				if (instance.element.getAttribute('id') === 'section-5') {
					console.log(progress)

					if (progress > previousProgress) {
						console.log('forwards')
					} else {
						console.log('backwards')
					}
				}
			}
		})
	])

	system.initialize()
})
