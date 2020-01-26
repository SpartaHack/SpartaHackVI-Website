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

let fail = (director, needed) => {
    if (needed && (!Array.isArray(needed) || !needed[0])) return

    let domBase = overlay('incomplete-app-report')
    
    domBase.title.innerHTML = 'Application Incomplete'
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
module.exports.default = fail

let success = director => {
    let domBase = overlay('complete-app-report')    
    domBase.title.innerHTML = 'Before we continue...'
    checks = []

    let getCheck = (body, sId) => {
        let wrap = document.createElement('p')
        wrap.className = "consentor"
        wrap.id = sId + 'Wrap'

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
    }, check
    Object.keys(conditions).forEach(cond => {
        check = getCheck(conditions[cond], cond)
        domBase.content.append(check)
    })

    let submitButton = document.createElement('button')
    submitButton.id="submit-button"
    submitButton.innerHTML = "Done"
    submitButton.addEventListener('click', 
        () => director.handler.submit())

    if (Array.isArray(checks))
        checks.forEach(c => c.addEventListener('change', () => {
            let total = checks.length
            let checked = 0

            checks.forEach(c => {if (c.checked) ++checked}) 
            console.log(checks)
            if (total === checked) 
                domBase.buttons.appendChild(submitButton)
            else if (domBase.content.lastChild.lastChild == submitButton)
                domBase.buttons.removeChild(submitButton)
        }) )

    return exp(domBase)
}
module.exports.success = success