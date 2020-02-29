require('./../scss/sheets/dashboard.scss') 
const login = require('./startup/login').default
;(require('./fa').default)()


let fillBanner = (auth, user, state) => {
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

    let message = document.getElementById('user-message')
    switch (state) { 
        case 0:
        temp = "You're set to start your application"
        break
        case 1:
        temp = "We've saved your progress!"
        break
        case 2: 
        case 3:
        temp = "Thanks for applying, we'll get back to you shortly"
        break
        case 4:
        temp = "Thanks for applying, but we have too many participants \
        and couldn't give you a spot this year."
        break
        case 5:
        temp = "We've reviewed your application and hope you can attend! \
        Please RSVP to secure your spot"
        break
        case 6:
        temp = "Almost there, please complete your RSVP!"
        break
        case 7: 
        case 8:
        temp = "Your spot is reserved, see you on 3/27!"
    }
    message.innerHTML = temp

    return
},

fillInfo = (auth, user, state) => {
    let name = document.getElementById('user-name')

    if (name && !user.name) 
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
},

fillButton = (auth, user, state) => {
    let button = document.getElementById('app-button'),
    btnIco = document.createElement('i'),
    btnText, btnLocation

    if (button.lastElementChild)
        button.removeChild(button.lastElementChild)

    switch(state) {
        case 0: btnText = "New"
        btnIco.className = 'fas fa-plus-square'
        break
        case 1: btnText = "Continue"
        break
        case 5: 
        case 6: btnText = "RSVP!"
        btnIco.className = 'fas fa-plus-square'
        break
        default: btnText = "Review"
    }
    button.innerHTML = btnText
    console.log(btnIco)
    if (!btnIco.className) 'fas fa-chevron-circle-right'
    console.log(btnIco.className)
    btnLocation = state > 4
        ? "/rsvp.html" : "/application.html"
    button.addEventListener('click', () => window.location = btnLocation )

    if (button.contains(btnIco))
        button.replaceChild(btnIco, btnIcfo)
    else button.appendChild(btnIco)

    return
},

status = (auth, user, state) => {
    let indicators = Array.from(document.getElementsByClassName('status')),
    indicatorDirections = [0, 0, 1, 1, 1, 2, 2, 3, 3],
    checkedIndicators = indicatorDirections[state],
    updateStatus = (statDom, state) => {
        console.log(indicatorDirections, state)
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

login([fillBanner, status, fillButton, fillInfo])
