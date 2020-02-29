let rsvpSent = (main, director, details) => {
    main.dom.title = "RSVP'd"
    main.dom.content.innerHTML = "<p>We'll see you there! About a week before the event, \
    you'll recieve an email with specific logistics.</p>"

    let homeButton = document.createElement('button')
    homeButton.id="home-button"
    homeButton.innerHTML = "Home"
    main.dom.buttons.appendChild(homeButton)
    homeButton.addEventListener('click', 
        () => window.location = window.location.origin)

    document.body.appendChild(main.dom.underlay)
    document.body.appendChild(main.dom.container)

    return main.dom
},
rsvpReport = { 'sent': rsvpSent}

module.exports.default = rsvpReport
