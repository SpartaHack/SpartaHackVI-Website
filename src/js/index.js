require.context('./../../assets')

import './../scss/sheets/index.scss'
import './../scss/sheets/footer.scss'
console.log('what')
const auth = require('./auth_cofig').default
// const faqs = require('./faq').default
console.log('what1')
auth(authObj => {
    document.getElementById('nav-apply')
    .addEventListener('click', () => authObj.authorize())

    document.getElementById('info-apply')
    .addEventListener('click', () => authObj.authorize())
})
console.log('what2')
// countdown.innerHTML = Math.ceil(
//         (new Date('12/1/19')-new Date())/(1000*3600*24)
//     ).toString() + countdown.innerHTML

// let faqs = new (require('./faq')).default(require('./data/faqs.json'))