require.context('./../../assets')

import './../scss/sheets/index.scss'
import './../scss/sheets/footer.scss'
const auth = require('./auth_cofig').default
const faqs = require('./faq').default

auth(authObj => {
    document.getElementById('nav-apply')
    .addEventListener('click', () => authObj.authorize())

    document.getElementById('info-apply')
    .addEventListener('click', () => authObj.authorize())
})

countdown.innerHTML = Math.ceil(
        (new Date('12/1/19')-new Date())/(1000*3600*24)
    ).toString() + countdown.innerHTML

faqs()