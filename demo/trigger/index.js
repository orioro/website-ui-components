import componentSystem from '../../src/system'
import trigger from '../../components/trigger'

const exampleComponent = {
	createInstance: (system, componentRoot, {}) => {
		const displayElement = document.createElement('div')
		displayElement.style.backgroundColor = 'skyblue'
		displayElement.style.padding = '20px'
		componentRoot.appendChild(displayElement)

		return {
			action1(param1, param2) {
				displayElement.innerHTML = `action1 ${param1}, ${param2}`
			},
			action2(param1, param2) {
				displayElement.innerHTML = `action2 ${param1}, ${param2}`
			},
			defaultAction () {
				displayElement.innerHTML = 'defaultAction'
			}
		}
	},
	componentName: 'example',
} 

exampleComponent.componentName = 'example'

document.addEventListener('DOMContentLoaded', e => {
	const system = componentSystem('component', [
		exampleComponent,
		trigger()
	])

	system.initialize()
})
