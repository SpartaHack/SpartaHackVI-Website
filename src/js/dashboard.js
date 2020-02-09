import './../scss/sheets/dashboard.scss'
let transactions = require('./transactions'),
login = require('./login').default
;(require('./fa').default)()
// *
let appState = () => +(window.localStorage.getItem('appState'))
// *
let fillBanner = async auth0 => {
    let temp,
    now = new Date(),
    tod = document.getElementById('time-of-day')
    now = now.getHours()

    switch (true) {
        case (now > 2 && now < 12):
        temp = 'morning'; break
        case (now > 16):
        temp = 'evening'; break
        default:
        temp = 'afternoon'
    }
    tod.innerHTML = temp
    // -
    let message = document.getElementById('user-message')

    switch (appState()) { 
        case 0:
        temp = "You're set to start your application"; break
        case 1:
        temp = "We've saved your progress"; break
        case 2: 
        case 3:
        temp = "Thanks for applying, we'll get back to you shortly"; break
        case 4:
        temp = "Thanks for applying, but we have too many participants \
        and couldn't give you a spot this year."; break
        case 5:
        temp = "We've reviewed your application and hope you can attend! \
        Please RSVP to secure your spot"; break
        case 6: 
        temp = "Thanks for the RSVP, see you on 3/27!"
        
    }
    message.innerHTML = temp
    return
}
// -
let fillInfo = async auth0 => {
    let user = transactions.userIn(),
    name = document.getElementById('user-name')
    if (!user) return 

    if (!user.name) 
        document.getElementById('user-attrs').removeChild(name)
    else name.innerHTML = user.name
    // -
    let email = document.getElementById('user-email'),
    img,
    refreshItems = [name, email],
    refresh = items => 
        items.forEach(i => i.replaceWith(i, i))

    email.innerHTML = user.email
    // -
    if (user.picture) {
        img = document.createElement('img')
        img.id = "profile-photo"
        img.alt = "Profile photo"

        let imgArea = document.getElementById('image-area')
        imgArea.innerHTML = ''
        imgArea.appendChild(img)
        refreshItems.push(img)

        img.addEventListener('load', e => refresh(refreshItems))
        img.src = user.picture
    }
    else refresh(refreshItems)
    return
}
// -
let fillButton = async auth0 => {
    let button = document.getElementById('app-button'),
    btnIco = document.createElement('i'),
    state = appState()
    btnIco.className = 'fas fa-chevron-circle-right'
    //*
    if (button.lastElementChild)
        button.removeChild(button.lastElementChild)
    if (!state) {
        button.firstElementChild.innerHTML = "New"
        btnIco.className = 'fas fa-plus-square'
    }
    else if (state == 1)
        button.firstElementChild.innerHTML = "Continue"
    else
        button.firstElementChild.innerHTML = "Review"
    
    // button.innerHTML = ''
    button.appendChild(btnIco)
    button.addEventListener('click', () => window.location = "/application.html")
    return
}
// -
let status = async auth0 => {
    let indicators = Array.from(document.getElementsByClassName('status')),
    indicatorDirections = [0, 0, 1, 1, 1, 2, 3],
    checkedIndicators = indicatorDirections[appState()],
    updateStatus = (statDom, state) => {
        statDom = statDom.lastElementChild
        let indicator = document.createElement('i')
        
        if (state) {
            statDom.firstElementChild.classList.add('on-indicator')
            indicator.className = "fas fa-check"
        }
        else {
            statDom.firstElementChild.classList.remove('on-indicator')
            indicator.className = "fas fa-times"
        }
        statDom.firstElementChild.innerHTML = ''
        statDom.firstElementChild.appendChild(indicator)
        return
    }
    
    for (let i = 0; i < 3; i++)
        updateStatus(indicators[i], i < checkedIndicators)

    return true
}


let startUp = async auth0 => {
    let user,
    updateInfo = () => { 
        user = transactions.userIn()
        return Boolean(user)
    },
    tryLoaded = (test, after, tryNum) => window.setTimeout(() => {
        tryNum = typeof tryNum == "number" ? tryNum : 0

        if (test()) after()
        else if (tryNum < 10) 
            tryLoaded(test, after, ++tryNum)
        else (login(() => {}))
    }, 500),
    after = () => {
        let getState = apiApp => {
            let state = 0
            apiApp = apiApp 
                ? apiApp : transactions.appIn(true)
            
            if (user.rsvp) state = 6
            else if (apiApp)
                switch(apiApp.status) {
                    case "Accepted":
                        state = 5
                    break
                    case "Rejected":
                        state = 4
                    break
                    default:
                        state = 3
                }
            else if (user.aid || window.localStorage.getItem('getApiApp')) {
                window.localStorage.removeItem('getApiApp')
                state = 2
            }
            else if (transactions.appIn())
                state = 1
            return state
        },
        setState = apiApp => {
            let state = getState(apiApp)
            window.localStorage.setItem('appState', state)
            return state
        }

        if (setState() == 2)
            transactions.getApp(user.pt, user.aid, app => {
                transactions.appOut(app, true)
                setState(app) 
                login([fillBanner, status, fillInfo, fillButton])
            })

        let afterAfter = [fillBanner, status, fillInfo, fillButton]
        afterAfter.forEach(f => f(auth0))
    }
    tryLoaded(updateInfo, after)

    return true
}
login(startUp)
