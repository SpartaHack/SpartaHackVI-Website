import './../scss/sheets/index.scss'
import './../scss/sheets/footer.scss'

;(require('./util').default)()

;(require('./auth_cofig').default)(authObj => {
    document.getElementById('nav-apply')
    .addEventListener('click', () => authObj.authorize())

    document.getElementById('info-apply')
    .addEventListener('click', () => authObj.authorize())
})

let faqs = new (require('./faq')).default(
    document.getElementById('faqs-wrap') )

;(require('./sponsors').default())
