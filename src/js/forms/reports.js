let reportDomBase = name => {
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
    buttons.appendChild(exitButton)

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
},
userError = (main, director, details) => {
    if (details && (!Array.isArray(details) || !details[0])) return
    
    main.dom.title.innerHTML = 'Incomplete Fields'
    main.dom.content.appendChild(document.createElement('p'))
    main.dom.content.firstChild.innerHTML = 
        'The following fields need to be completed or changed'

    let neededItems = document.createElement('ul')
    neededItems.id = 'needed-items'

    details.forEach(neededField => {
        neededItems.appendChild(document.createElement('li'))
        neededItems.lastChild.innerHTML = director.handler.getError(neededField)
    })
    main.dom.content.appendChild(neededItems)

    return main.dom
},
otherError = (main, director, details) => {
    main.dom.content.id = "other-submission-error"
    main.dom.title.innerHTML = 'Sorry'
    main.dom.content.innerHTML = ' \
        <p>Something appears to have gone wrong on our end. Please \
        <a href="mailto:hello@spartahack.com" target="_blank">email us \
        (hello@spartahack.com)</a> the error!</p>'
 
    let error = document.createElement('p')
    error.innerHTML = details.status+": "+(details.message ? details.message : "Unkown error")
    error.className = 'submission-error'
    main.dom.content.appendChild(error)
    
    let logoutButton = document.createElement('button')
    logoutButton.id="logout-button"
    logoutButton.innerHTML = "Logout"

    logoutButton.addEventListener('click', e => director.handler.logout())
    // LOGOUT (hard) CLICK LISTENER
    console.log(main.dom)
    if (main.dom.buttons.lastChild)
        main.dom.buttons.replaceChild(logoutButton, main.dom.buttons.lastChild)
    else main.dom.buttons.appendChild(logoutButton)

    main.dom.container.replaceChild(main.dom.report, main.dom.report)
    return main.dom
},
authError = (main, director, details) => {
    main.dom.content.id = "token-submission-error"
    main.dom.title.innerHTML = 'Have you been here for a while?'
    main.dom.content.innerHTML = "<p>We've saved your application, please re-submit after logging back in!</p>"

    main.dom.buttons.removeChild(main.dom.buttons.lastChild)

    let autoLogoutButton = document.createElement('button')
    autoLogoutButton.id="auto-logout-button"
    autoLogoutButton.innerHTML = "Logout"

    let autoLogoutWrap = document.createElement('div')
    autoLogoutWrap.appendChild(autoLogoutButton)
    autoLogoutWrap.appendChild(document.createElement('h5'))
    // AUTO LOGOUT AND LOGOUT CLICK LISTENER (soft)
    main.dom.buttons.appendChild(autoLogoutWrap)

    autoLogoutWrap.lastChild.innerHTML = "(10s)"
    let updateTime = time => window.setTimeout(() => {
        autoLogoutWrap.lastChild.innerHTML = "(" + (--time).toString() + "s)"
        if (time > 0) updateTime(time)
        else logout(director)
    }, 1000)
    updateTime(10)

    autoLogoutButton.addEventListener('click', e => logout(director))
    return main.dom
}

class reports {
    constructor(director, conditions) {
        this.director = director
        this.dom = reportDomBase()

        this.conditions = {
            '401': authError,
            'userError': userError,
            'otherError': otherError
        }
        if (conditions)
            Object.assign(this.conditions, conditions)
    }

    get needsConfirmation() {
        return this.conditions.hasOwnProperty('completed')
    }

    toDom() {
        window.scrollTo(0,0)

        if (!document.body.contains(this.dom.underlay))
            document.body.appendChild(this.dom.underlay)

        if (document.body.contains(this.dom.container))
            document.querySelector('.report-container').replaceWith(this.dom.container)
        else document.body.appendChild(this.dom.container)
    }

    update(condition, details) {
        if (document.body.contains(this.dom.underlay))
            document.body.removeChild(this.dom.underlay)
        if (document.body.contains(this.dom.report))
            document.body.removeChild(this.dom.report)
            
        this.dom = reportDomBase()
        condition = String(condition)
        condition = this.conditions.hasOwnProperty(condition)
            ? condition : otherError

        this.conditions[condition](this, this.director, details)
        this.toDom()
    }

    isSent(details) { this.update('sent', details) }
    userErrored(details) { this.update('userError', details) }
    confirmForm(details) { this.update('completed', details) }
}

module.exports.default = reports
