import '@fortawesome/fontawesome-free/js/fontawesome'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTimes, faCheck, faChevronCircleRight, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

let fontAwesome = () => {
    library.add(faSearch, faTimes, faCheck, faChevronCircleRight, faPlusSquare)
    dom.i2svg()
}
export default fontAwesome
