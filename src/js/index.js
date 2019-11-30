require.context('./../../assets')
import './../scss/sheets/nav.scss'
import './../scss/sheets/index.scss'
import './../scss/sheets/footer.scss'
const auth = require('./auth_cofig').default

auth(
    authObj => document.getElementById('nav-login')
    .addEventListener('click', () =>
        authObj.loginWithRedirect({
            redirect_uri: "http://localhost:9000/dashboard.html"
        }) )
)
