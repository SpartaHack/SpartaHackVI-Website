let indDom = (item, main, listings) => {
    let listing = document.createElement('li')
    listing.className = 'question-wrap'
    listing.tabIndex = 0

    let content = document.createElement('div')
    content.className = 'answer'

    listing.appendChild(document.createElement('h4'))
    listing.firstElementChild.innerHTML = item.question
    listing.firstElementChild.class = 'question'

    content.appendChild(document.createElement('div'))
    content.firstElementChild.id = "answer-content-wrap"

    let head = document.createElement('div')
    head.appendChild(document.createElement('h2'))
    head.lastElementChild.innerHTML = item.question

    let exit = document.createElement('i')
    exit.className = "fas fa-times"
    exit.alt = "exit faq"
    head.appendChild(exit)
    
    content.firstElementChild.appendChild(head)

    content.firstElementChild.appendChild(document.createElement('p'))
    content.firstElementChild.lastElementChild.innerHTML = item.answer

    let ntr = () => {
        main.removeChild(main.lastElementChild)
        main.appendChild(content)
    }
    listing.addEventListener('click', ntr)

    let xit = () => {
        main.removeChild(main.lastElementChild)
        main.appendChild(listings)
    }
    
    let getContent = () => {
        exit.addEventListener('click', xit)

        let esc = window.addEventListener('click', e => {
            if (e == 27) xit
            window.removeEventListener('click', xit)
        })

        return content
    }

    return {'listing': listing, 'content': getContent}
}

let dom = items => {
    let container = document.createElement('section')
    container.id = "faqs-wrap"
    let wrap = document.createElement('div')
    wrap.id = "faqs-questions"

    wrap.appendChild(document.createElement('h3'))
    wrap.firstElementChild.innerHTML = 'FAQs'
    wrap.firstElementChild.id ="questions-title"
    
    let db = {}
    wrap.appendChild(document.createElement('ul'))
    items.forEach(i => {
        let elems = indDom(i, container, wrap)
        db[i.id] = elems.content()
        wrap.lastElementChild.appendChild(elems.listing)
    });
    container.appendChild(wrap)
    return container
}

module.exports.default = wrap => {
    document.body.append(dom(require('./data/faqs.json')))
}