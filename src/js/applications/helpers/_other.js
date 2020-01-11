// selectOther(id) {
//     let alt = document.createElement('input')
//     alt.type = "text"
//     alt.id = fieldItems.dom.id
//     alt.placeholder = "List: Backspace"

//     fieldItems.dom.parentNode.replaceChild(alt, fieldItems.dom)
//     fieldItems['old'] = fieldItems.dom
//     fieldItems.dom = alt

//     fieldItems.dom.addEventListener('change', () => this.update(fieldItems.dom))
//     fieldItems.dom.addEventListener('keyup', e => {
//         if (e.keyCode === 8 && fieldItems.dom.value.length == 0) 
//             this.swapBack(fieldItems) } )
// }

let ready = () => {


}
module.exports.default = ready
