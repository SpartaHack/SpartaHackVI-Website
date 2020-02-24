const transactions = require('./transactions'),
request = require('./request')

let preSubmission = () => {
    let wrap = document.createElement('form'),
    header = document.createElement('h4'),
    uploadWrap = document.createElement('span'),
    resumeBox = document.createElement('input'),
    resumeInfo = document.createElement('p'),
    rsvpAction = document.createElement('button')

    wrap.id = "rsvpForm"
    header.id = "resumeRequest"
    resumeBox.id = "resumeUpload"
    resumeInfo.id = "resumeExplanation"
    rsvpAction.id = "submitRsvp"

    resumeBox.type = "file"
    resumeBox.accept = ".pdf, .docx, .doc"
    
    header.innerHTML = "Please upload your resume"
    resumeInfo.innerHTML = "PDF || DOCX"
    rsvpAction.innerHTML = "RSVP!"

    uploadWrap.appendChild(resumeBox)
    uploadWrap.appendChild(resumeBox)
    wrap.appendChild(header)
    wrap.appendChild(uploadWrap)
    wrap.appendChild(rsvpAction)

    wrap.className = 'rsvpDialougue'
    return {
        'wrap': wrap,
        'action': rsvpAction
    }
},
postSubmission = () => {
    let wrap = document.createElement('aside'),
    splashMessage = document.createElement('h3')

    wrap.className = 'rsvpDialougue'
    return {}
}

module.exports.incomplete = target => {

    let formItems = preSubmission(),
    rsvpReq = {

    },
    rsvpCb = () => {
    
    }

    target.appendChild(preSubmission)
}

module.exports.complete = target => {
    target.appendChild(postSubmission)
}