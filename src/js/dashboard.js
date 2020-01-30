import './../scss/sheets/dashboard.scss'
let transactions = require('./transactions'),
login = require('./login').default
;(require('./fa').default)()
// *

// *
let fillBanner = async (auth0, userInfo) => {
    userInfo = userInfo ? userInfo
        : JSON.parse(window.sessionStorage.getItem('userInfo', userInfo))
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
    console.log(userInfo, userInfo.state)
    switch (userInfo.state) {
        case 0:
        temp = "You're set to start your application"; break
        case 1:
        temp = "We've saved your progress"; break
        case 2: case 3:
        temp = "Thanks for applying, we'll get back to you shortly"; break
        case 4:
        temp = "Thanks for applying, but we have too many participants \
        and couldn't give you a spot this year."; break
        case 5:
        temp = "We've reviewed your application and hope you can attend! \
        Please RSVP to secure your spot"; break
        case 6: 
        temp = "Thanks for the RSVP, see you at Spartahack!"; break

        default: temp = "Something went wrong..."
    }
    message.innerHTML = temp

    return
}
// -
let fillInfo = async (auth0, userInfo) => {
    userInfo = userInfo ? userInfo
        : JSON.parse(window.sessionStorage.getItem('userInfo', userInfo))
    let info = transactions.stuinfoIn,
    name = document.getElementById('user-name')

    if (info.name === info.email) 
        document.getElementById('user-attrs').removeChild(name)
    else name.innerHTML = info.name
    // -
    let email = document.getElementById('user-email'),
    img,
    refreshItems = [name, email],
    refresh = items => 
        items.forEach(i => i.parentElement.replaceChild(i, i) )

    email.innerHTML = info.email
    // -
    if (info.picture) {
        img = document.createElement('img')
        img.id = "profile-photo"
        img.alt = "Profile photo"

        document.getElementById('image-area').appendChild(img)
        refreshItems.push(img)

        img.addEventListener('load', e => refresh(refreshItems))
        img.src = info.picture
    }
    else refresh(refreshItems)
    return
}
// -
let fillButton = async (auth0, userInfo) => {
    userInfo = userInfo ? userInfo
        : JSON.parse(window.sessionStorage.getItem('userInfo', userInfo))
    let button = document.getElementById('app-button')
    let btnIco = document.createElement('i')
    btnIco.className = 'fas fa-chevron-circle-right'
    //*
    if (!userInfo.state) {
        button.firstElementChild.innerHTML = "New"
        btnIco.className = 'fas fa-plus-square'
    }
    else if (userInfo.state === 1)
        button.firstElementChild.innerHTML = "Continue"
    else
        button.firstElementChild.innerHTML = "Review"
    
    button.appendChild(btnIco)
    button.addEventListener('click', () => window.location = "/application.html")
    return
}
// -
let status = async (auth0, userInfo) => {
    userInfo = userInfo ? userInfo
        : JSON.parse(window.sessionStorage.getItem('userInfo', userInfo))
    let indicators = Array.from(document.getElementsByClassName('status')),
    indicatorDirections = [0, 0, 1, 1, 1, 2, 3],
    checkedIndicators = indicatorDirections[userInfo.state],
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
        statDom.firstElementChild.appendChild(indicator)
        return
    }
    
    for (let i = 0; i < 3; i++)
        updateStatus(indicators[i], i < checkedIndicators)
}


let startUp = async auth0 => {
    let info,
    updateInfo = () => { 
        info = transactions.userIn()
        console.log('here', info)
        return Boolean(info)
    },
    tryLoaded = (test, after, tryNum) => window.setTimeout(() => {
        tryNum = typeof tryNum == "number" ? tryNum : 0
        console.log(tryNum)
        if (test()) after()
        else if (tryNum < 10) 
            tryLoaded(test, after, ++tryNum)
    }, 500),
    after = () => {
        console.log(info)
        console.log('here')
        let userInfo = {
            'appId': info['http://website.elephant.spartahack.com' + '/aid'],
            'rsvpId': info['http://website.elephant.spartahack.com' + '/rsvp'],
            'auth': info['http://website.elephant.spartahack.com' + '/pt']
        },
        getState = apiApp => {
            let state = 0
            apiApp = apiApp 
                ? apiApp : transactions.appIn(true)
    
            if (userInfo.rsvpId) state = 6
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
            else if (userInfo.appId)
                state = 2
            else if (transactions.appIn())
                state = 1
            
            return state
        }

        let setState = apiApp => {
            let state = getState(apiApp)
            window.localStorage.setItem('appState', state)
            return state
        }
        if (setState() == 2)
            transactions.getApp(userInfo.auth, userInfo.appId, app => {
                transactions.appOut(app, true)
                setState()
                login([fillBanner, status, fillInfo, fillButton])
            })
    }
    tryLoaded(updateInfo, after)
}
login([startUp, fillBanner, status, fillInfo, fillButton])
