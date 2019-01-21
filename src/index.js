import system from '@orioro/website-ui-components/src/system'
import dialog from '@orioro/website-ui-components/components/dialog'
import tabs from '@orioro/website-ui-components/components/tabs'
import trigger from '@orioro/website-ui-components/components/trigger'
import scrollTarget from '@orioro/website-ui-components/components/scroll-target'

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
