import './../scss/sheets/dashboard.scss'
let getApp = require('./applications/transactions').getApp,
login = require('./login').default
;(require('./fa').default)()
// *

// *
let fillBanner = async (auth0, userInfo) => {
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
    let info,
    updateInfo = () => {
        info = JSON.parse(window.localStorage.getItem('stuinfo'))
        return Boolean(info)
    },
    tryLoaded = (test, after, tryNum) => window.setTimeout(() => {
        tryNum = typeof tryNum == "number" ? tryNum : 0
        if (test()) after()
        else if (tryNum < 10) 
            tryLoaded(test, after, ++tryNum)
    }, 500),
    fill = () => {
        let name = document.getElementById('user-name')
        if (info.name === info.email) document.getElementById('user-attrs').removeChild(name)
        else name.innerHTML = info.name
        // -
        let email = document.getElementById('user-email')
        email.innerHTML = info.email
        // -
        let img,
        refreshItems = [name, email],
        refresh = items => 
            items.forEach(i => i.parentElement.replaceChild(i, i) )
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
    }

    tryLoaded(updateInfo, fill)

    return
}
// -
let fillButton = async (auth0, userInfo) => {
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

let startUp = () => {
    let locApp = () => window.localStorage.getItem('locApp'),
    apiApp = () => window.localStorage.getItem('apiApp'),
    info = JSON.parse(window.localStorage.getItem('stuinfo')),
    userInfo = {
        'appId': info['http://website.elephant.spartahack.com' + '/aid'],
        'rsvpId': info['http://website.elephant.spartahack.com' + '/rsvp'],
        'auth': info['http://website.elephant.spartahack.com' + '/pt']
    },
    getState = () => {
        let state = 0

        if (userInfo.rsvpId) state = 6
        else if (apiApp())
            switch(JSON.parse(apiApp()).status) {
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
        else if (locApp())
            state = 1
        
        return state
    }
    userInfo['state'] = getState()

    let startUpSequence = info => 
        login([fillBanner, fillInfo, fillButton, status], info)

    if (userInfo.state == 2)
        getApp(userInfo.auth, userInfo.appId, app => {
            window.localStorage.setItem('apiApp', JSON.stringify(app)),
            userInfo.state = getState()
            startUpSequence(userInfo)
        })
    else startUpSequence(userInfo)

}

startUp()
