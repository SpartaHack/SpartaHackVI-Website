require.context('./../../assets')
import '../scss/index.scss'
const auth = require('./auth_cofig').default

auth(
    authObj => document.getElementById('nav-login')
    .addEventListener('click', () => authObj.loginWithPopup())
)
