module.exports.default = () => {
    let container = document.createElement('div'),
    underlay = document.createElement('div'),
    contentArea = document.createElement('article'),
    title = document.createElement('h3'),
    content = document.createElement('span'),
    exit = document.createElement('button')

    underlay.className = "covid19-cancellation cancellation-bg"
    underlay.id = "cancellation-underlay"
    container.className = "covid19-cancellation cancellation-bg"
    container.id = "cancellation-wrapper"
    contentArea.className = "covid19-cancellation"
    contentArea.id = "cancellation-announcement"
    title.className = "covid19-cancellation"
    title.id = "cancellation-title"
    title.innerHTML = "SpartaHack VI has been cancelled"
    content.className = "covid19-cancellation"
    content.id = "cancellation-details"
    exit.className = "covid19-cancellation"
    exit.id = "exit-announcement"
    exit.innerHTML = "Okay"

    content.appendChild(document.createElement('p'))
    content.lastChild.innerHTML = "We are disappointed and sorry to say that our team will not host SpartaHack VI. This cancellation is in cooperation with goals of our governor Gretchen Whitmer’s state of emergency and Michigan State University’s COVID-19 preparedness strategy. We appreciate all of your interest and would have loved to see the resulting projects. Next spring’s SpartaHack planning is ongoing, and we hope for our hacker community’s ongoing engagement. If you have any questions or concerns about the event, please reach out on our Facebook, Twitter, or hello@spartahack.com.<br><br>Thank you,\
    SpartaHack VI Team"
    contentArea.appendChild(title)
    contentArea.appendChild(content)
    contentArea.appendChild(exit)
    container.appendChild(contentArea)
    exit.focus()

    window.scrollTo(0, 0)
    document.body.appendChild(underlay)
    document.body.appendChild(container)

    document.body.classList.add('modal-lock')
    window.sessionStorage.setItem('cn', 'yes')

    let remove = e => {
        document.body.classList.remove('modal-lock')
        document.body.removeChild(container)
        document.body.removeChild(underlay)
    }
    underlay.addEventListener('click', remove)
    exit.addEventListener('click', remove)
    exit.addEventListener('keyup', e => {
        if (e.keyCode == 13 || e.keyCode == 32)
            remove()
    })

    
}