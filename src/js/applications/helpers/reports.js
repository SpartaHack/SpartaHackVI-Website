let overlay = name => {
    let underlay = document.createElement('div')
    underlay.id = name + '-bg'
    underlay.className = 'report-underlay'

    let reportWrap = document.createElement('aside')
    reportWrap.id = name
    reportWrap.className = 'report-content'

    let reportContainer = document.createElement('div')
    reportContainer.className = 'report-container'

    let reportTitle = document.createElement('h2')
    reportWrap.appendChild(reportTitle)

    let reportContent = document.createElement('div')
    reportWrap.appendChild(reportContent)

    reportContainer.appendChild(reportWrap)

    let buttons = document.createElement('div')
    buttons.id = "report-responses"
    reportWrap.appendChild(buttons)

    let exitButton = document.createElement('button')
    exitButton.id="exit-button"
    exitButton.innerHTML = "Exit"

    let removeModal = () => {
        document.body.removeChild(reportContainer)
        document.body.removeChild(underlay)
    }
    exitButton.addEventListener('click', removeModal)
    underlay.addEventListener('click', removeModal)

    return {
        'container': reportContainer, 'report': reportWrap,
        'title': reportTitle, 'content':reportContent,
        'buttons': buttons, 'exitButton': exitButton,
        'underlay': underlay
    }
}

let exp = domBase => {
    domBase.buttons.appendChild(domBase.exitButton)
    return domBase
}

// ---

let logout = director => director.handler.logout()
let newToken = (domBase, director) => {
    domBase.content.id = "token-submission-error"
    domBase.title.innerHTML = 'Have you been here for a while?'
    domBase.content.innerHTML = "<p>We've saved your application, please re-submit after logging back in!</p>"

    domBase.buttons.removeChild(domBase.buttons.lastChild)

    let autoLogoutButton = document.createElement('button')
    autoLogoutButton.id="auto-logout-button"
    autoLogoutButton.innerHTML = "Logout"

    let autoLogoutWrap = document.createElement('div')
    autoLogoutWrap.appendChild(autoLogoutButton)
    autoLogoutWrap.appendChild(document.createElement('h5'))
    // AUTO LOGOUT AND LOGOUT CLICK LISTENER (soft)
    domBase.buttons.appendChild(autoLogoutWrap)

    autoLogoutWrap.lastChild.innerHTML = "(10s)"
    let updateTime = time => window.setTimeout(() => {
        autoLogoutWrap.lastChild.innerHTML = "(" + (--time).toString() + "s)"
        if (time > 0) updateTime(time)
        else logout(director)
    }, 1000)
    updateTime(10)

    autoLogoutButton.addEventListener('click', e => logout(director))
    domBase.container.replaceChild(domBase.report, domBase.report)
}

let fail = (domBase, director, details) => {
    domBase.content.id = "other-submission-error"
    domBase.title.innerHTML = 'Sorry'
    domBase.content.innerHTML = ' \
        <p>Something appears to have gone wrong on our end. Please \
        <a href="mailto:hello@spartahack.com" target="_blank">email us \
        (hello@spartahack.com)</a> the error!</p>'
 
    let error = document.createElement('p')
    error.innerHTML = details.status+": "+(details.message ? details.message : "Unkown error")
    error.className = 'submission-error'
    domBase.content.appendChild(error)
    
    let logoutButton = document.createElement('button')
    logoutButton.id="logout-button"
    logoutButton.innerHTML = "Logout"

    logoutButton.addEventListener('click', e => logout(director))
    // LOGOUT (hard) CLICK LISTENER
    console.log(domBase)
    if (domBase.buttons.lastChild)
        domBase.buttons.replaceChild(logoutButton, domBase.buttons.lastChild)
    else domBase.buttons.appendChild(logoutButton)

    domBase.container.replaceChild(domBase.report, domBase.report)
}

let success = (domBase, director) => {
    domBase.content.id = "successful-submission"
    domBase.title.innerHTML = "Thanks!"
    domBase.content.innerHTML = "<p>We've recieved you application. Once it's reviewed, you'll get an email from us!"  

    domBase.buttons.removeChild(domBase.buttons.lastChild)

    let homeButton = document.createElement('button')
    homeButton.id="home-button"
    homeButton.innerHTML = "Home"
    domBase.buttons.appendChild(homeButton)
    homeButton.addEventListener('click', 
        () => window.location = window.location.origin)

    let dashboardButton = document.createElement('button')
    dashboardButton.id="dashboard-button"
    dashboardButton.innerHTML = "My Dashboard"
    domBase.buttons.appendChild(dashboardButton)

    dashboardButton.addEventListener('click', 
        () => window.location = window.location.origin + '/dashboard.html')

    director.postSubmission()
    domBase.container.replaceChild(domBase.report, domBase.report)
}

let responseConditions = (domBase, director) => ({
    'Applied': () => success(domBase, director),
    '402': () => newToken(domBase, director),
    '500': () => newToken(domBase, director),
    'otherError': contents => fail(domBase, director, contents),
})

// ---

let userFail = (director, needed) => {
    if (needed && (!Array.isArray(needed) || !needed[0])) return

    let domBase = overlay('incomplete-app-report')
    
    domBase.title.innerHTML = 'Incomplete Fields'
    domBase.content.appendChild(document.createElement('p'))
    domBase.content.firstChild.innerHTML = 
        'The following fields need to be completed or changed'

    let neededItems = document.createElement('ul')
    neededItems.id = 'needed-items'

    needed.forEach(nf => {
        neededItems.appendChild(document.createElement('li'))
        neededItems.lastChild.innerHTML = director.handler.getError(nf)
    })

    domBase.content.appendChild(neededItems)

    return exp(domBase) 
}
module.exports.default = userFail

let appSuccess = director => {
    let domBase = overlay('complete-app-report')
    domBase.title.innerHTML = 'Before we continue...'
    checks = []

    let getCheck = (body, sId, tI) => {
        let wrap = document.createElement('p')
        wrap.className = "consentor"
        wrap.id = sId + 'Wrap'
        wrap.tabIndex = tI

        wrap.appendChild(document.createElement('input'))
        wrap.lastChild.type = "checkbox"
        wrap.lastChild.id = sId
        checks.push(wrap.lastChild)

        wrap.appendChild(document.createElement('span'))
        wrap.lastChild.innerHTML = body
        return wrap
    }
    
    let conditions = {
        'privacy': 'I authorize you to share certain application/registration information for \
        event administration, ranking, MLH administration, pre and post-event informational \
        e-mails, and occasional messages about hackathons in-line with the MLH Privacy Policy.\
        I further I agree to the terms of both the MLH Contest Terms and Conditions \
        and the MLH Privacy Policy.',

        'conduct': 'I have read and agree to the MLH Code of Conduct.'
    }
    let cKeys = Object.keys(conditions)
    for (let i = 0; i < cKeys.length; i++) {
        let check = getCheck(conditions[cKeys[i]], cKeys[i], i)
        domBase.content.append(check)
    }

    let submitButton = document.createElement('button')
    submitButton.id="submit-button"
    submitButton.innerHTML = "Done"
    

    if (Array.isArray(checks))
        checks.forEach(c => c.addEventListener('change', () => {
            let checked = 0
            let total = checks.length
            checks.forEach(c => {if (c.checked) ++checked}) 

            if (total === checked) 
                domBase.buttons.appendChild(submitButton)
            else if (domBase.buttons.lastChild == submitButton)
                domBase.buttons.removeChild(submitButton)
                

            checked = 0
        }) )
    

    domBase = exp(domBase)
    submitButton.addEventListener('click', 
        () => director.handler.submit(responseConditions(domBase, director)) )

    return domBase
},
rsvpSuccess = (director, response) => {
    let domBase = overlay('rsvp-submission-report')
    director.handler.altSubmit(rsvpReponses)

    domBase.title = "RSVP'd"

    domBase.content.innerHTML = "<p>We'll see you there! About a week before the event, \
    you'll recieve an email with specific logistics.</p>"

    let homeButton = document.createElement('button')
    homeButton.id="home-button"
    homeButton.innerHTML = "Home"
    domBase.buttons.appendChild(homeButton)
    homeButton.addEventListener('click', 
        () => window.location = window.location.origin)

    document.body.appendChild(domBase.underlay)
    document.body.appendChild(domBase.reportContainer)

},
rsvpFail = (director, response) => {
    let domBase = overlay('rsvp-submission-report')

    fail(domBase, director, response)
    // domBase.buttons.appendChild(document.createElement('div'))
    // // console.log(domBase)
    document.body.appendChild(domBase.underlay)
    document.body.appendChild(domBase.reportContainer)
},
rsvpReponses = ({
    '201': rsvpSuccess,
    'otherError': rsvpFail,
}),
userSuccess = director =>
    director.fromApi != -1 ? 
        appSuccess(director) : director.handler.altSubmit(rsvpReponses)

module.exports.success = userSuccess
