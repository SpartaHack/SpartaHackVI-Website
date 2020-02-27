import './../scss/sheets/index.scss'
;(require('./fa').default)()

let auth0 = require('auth0-js').default.WebAuth,
env = require('./../../env.json'),
applyButton = async () => {
    let auth = await new auth0(env.auth)

    document.getElementById('nav-apply')
        .addEventListener('click', () => auth.authorize())

    document.getElementById('info-apply')
        .addEventListener('click', () => auth.authorize())
}
applyButton()

let faqs = new (require('./faq')).default(
    document.getElementById('faqs-wrap') )

;(require('./sponsors').default())
