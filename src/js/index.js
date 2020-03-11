import './../scss/sheets/index.scss'
;(require('./covidCancel').default)()
;(require('./fa').default)()

// let applyButtons = [
//     document.getElementById('info-apply'), 
//     document.getElementById('nav-apply'),
// ],
// startButton = targetButton => {
//     targetButton.style.visibility = 'visible'
//     targetButton.addEventListener('click', 
//         () => window.location = "/dashboard.html")
// }
// applyButtons.forEach(b => startButton(b))


let faqs = new (require('./faq')).default(
    document.getElementById('faqs-wrap') )

;(require('./sponsors').default())
