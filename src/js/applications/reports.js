let completedApp = (main, director, details) => {
    main.dom.title.innerHTML = 'Before we continue...'
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
        main.dom.content.append(check)
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
                main.dom.buttons.appendChild(submitButton)
            else if (main.dom.buttons.lastChild == submitButton)
                main.dom.buttons.removeChild(submitButton)
                

            checked = 0
        }) )

    submitButton.addEventListener('click', 
        () => director.done("confirmed") )

    return main.dom
},
appSent = (main, director, details) => {
    main.dom.content.id = "successful-submission"
    main.dom.title.innerHTML = "Thanks!"
    main.dom.content.innerHTML = "<p>We've recieved you application. Once it's reviewed, you'll get an email from us!"  

    main.dom.buttons.removeChild(main.dom.buttons.lastChild)

    let homeButton = document.createElement('button')
    homeButton.id="home-button"
    homeButton.innerHTML = "Home"
    main.dom.buttons.appendChild(homeButton)
    homeButton.addEventListener('click', 
        () => window.location = window.location.origin)

    let dashboardButton = document.createElement('button')
    dashboardButton.id="dashboard-button"
    dashboardButton.innerHTML = "My Dashboard"
    main.dom.buttons.appendChild(dashboardButton)

    dashboardButton.addEventListener('click', 
        () => window.location = window.location.origin + '/dashboard.html')

    main.dom.container.replaceChild(main.dom.report, main.dom.report)
},
reportItems = {
    'completed': completedApp,
    '201': appSent
}

module.exports.default = reportItems
