// require.context('./../../assets')

import '@fortawesome/fontawesome-free/js/fontawesome'
// import '@fortawesome/fontawesome-free/js/solid'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTimes, faCheck, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
let fontAwesome = () => {
    library.add(faSearch, faTimes, faCheck, faChevronCircleRight)
    dom.i2svg()
}
export default fontAwesome
