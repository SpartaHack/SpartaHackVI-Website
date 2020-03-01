import './../scss/sheets/index.scss'
;(require('./fa').default)()

let auth0 = require('auth0-js').default.WebAuth,
env = require('./../../env.json'),
navApply = document.getElementById('nav-apply'),
infoApply = document.getElementById('info-apply'),
applyButton = async () => {
    let auth = await new auth0(env.auth),
    startAuth = targetButton => {
        targetButton.style.visibility = 'visible'
        targetButton.addEventListener('click', () => auth.authorize())
    }

    startAuth(navApply)
    startAuth(infoApply)
}

applyButton()

let faqs = new (require('./faq')).default(
    document.getElementById('faqs-wrap') )

;(require('./sponsors').default())
