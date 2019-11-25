require.context('./../../assets')
import './../scss/sheets/nav.scss'
import './../scss/sheets/index.scss'
import './../scss/sheets/footer.scss'
const auth = require('./auth_cofig').default

auth(
    authObj => document.getElementById('nav-login')
    .addEventListener('click', () => authObj.loginWithPopup())
)

let countdown = document.getElementById('countdown')

countdown.innerHTML = Math.floor((new Date('12/1/19')- new Date())/(1000*3600*24)).toString() + countdown.innerHTML