import './../scss/sheets/dashboard.scss'
let getApp = require('./applications/transactions').getApp
let login = require('./login').default
;(require('./fa').default)()

let appState = () => {
    let current = window.localStorage.hasOwnProperty('application') ? 
        window.localStorage.getItem('application') : undefined

    let info = window.localStorage.hasOwnProperty('stutoken') ? 
        JSON.parse(window.localStorage.getItem('stutoken')) : undefined

    if (info && info.rsvp) return 5

    else if (!current && (!info || !info.aid)) return 0

    else if (info && info.aid) 
        return getApp(info, current)

    return 1
}
const thisState = appState()
// *
let fillBanner = async auth0 => {
    let temp,
    now = new Date(); now = now.getHours(),
    tod = document.getElementById('time-of-day')
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
    switch (thisState) {
        case 0:
        temp = "You're set to start your application"; break
        case 1:
        temp = "We've saved your spot"; break
        case 2:
        temp = "Thanks for applying, we'll get back to you shortly"
        case 3:
        temp = "Thanks for applying, but we have too many participants \
        and couldn't give you a spot this year :("; break
        case 4:
        temp = "Congratulations on your acceptance! Please RSVP to \
        secure your spot"; break
        case 5: 
        temp = "Thanks for the RSVP! See you January 31st"; break

        default: temp = "Something went wrong..."
    }
    message.innerHTML = temp

    return
}
// -
let fillInfo = async auth0 => {
    let info
    let updateInfo = () => {
        info = JSON.parse(window.localStorage.getItem('stuinfo'))
        return Boolean(info)
    }

    let tryLoaded = (test, after, tryNum) => window.setTimeout(() => {
        tryNum = typeof tryNum == "number" ? tryNum : 0
        if (test()) after()
        else if (tryNum < 10) 
            tryLoaded(test, after, ++tryNum)
    }, 500)

    
    let fill = () => {
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
let fillButton = async auth0 => {
    let button = document.getElementById('app-button')
    let btnIco = document.createElement('i')
    //*
    if (!thisState) {
        button.firstElementChild.innerHTML = "New"
        btnIco.className = 'fas fa-plus-square'

    }
    else {
        button.firstElementChild.innerHTML = "Continue"
        btnIco.className = 'far fa-caret-square-right'
    }
    button.appendChild(btnIco)
    button.addEventListener('click', () => window.location = "/application.html")
    return
}
// -

let updateStatus = (statDom, state) => {
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
let status = async auth0 =>
    Array.from(document.getElementsByClassName('status'))
        .forEach(s => updateStatus(s, false))

login([fillBanner, fillInfo, fillButton, status])
