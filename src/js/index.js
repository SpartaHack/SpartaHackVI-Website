import './../scss/sheets/index.scss'
import './../scss/sheets/footer.scss'

;(require('./login').default)(authObj => {
    document.getElementById('nav-apply')
    .addEventListener('click', () => authObj.authorize())

    document.getElementById('info-apply')
    .addEventListener('click', () => authObj.authorize())
})

let faqs = new (require('./faq')).default(
    document.getElementById('faqs-wrap') )

//;(require('./sponsors').default())
