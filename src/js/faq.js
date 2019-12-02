require('./../scss/components/faqs.scss')
var currentListing = 0



let indDom = (item, answerSpace, indOffset) => {
    if (!item) return 
    indOffset = indOffset ? indOffset : 3

    let listing = document.createElement('span')
    listing.className = 'question-wrap'
    listing.tabIndex = indOffset + ++currentListing

    // let content = document.createElement('div')
    // content.className = 'answer'

    listing.appendChild(document.createElement('h4'))
    listing.firstElementChild.innerHTML = item.question
    listing.firstElementChild.class = 'question'

    // content.appendChild(document.createElement('div'))
    // content.firstElementChild.className = "answer-content-wrap"

    // let head = document.createElement('div')
    // head.appendChild(document.createElement('h2'))
    // head.lastElementChild.innerHTML = item.question

    // let exit = document.createElement('i')
    // exit.className = "fas fa-times"
    // exit.alt = "exit faq"
    // head.appendChild(exit)
    
    // content.firstElementChild.appendChild(head)
    // content.firstElementChild.appendChild()
    // content.firstElementChild.lastElementChild.innerHTML = 

    let content = document.createElement('p')
    content.innerHTML = item.answer

    let ntr = () => 
        answerSpace.appendChild(content)    
    let xit = () => 
        answerSpace.removeChild(content)    
    
    let getContent = () => {
        // exit.addEventListener('click', xit)

        let esc = window.addEventListener('keup', e => {
            if (e == 27) xit
            window.removeEventListener('click', xit)
        })

        return content
    }

    listing.addEventListener('click', ntr)
    return {'listing': listing, 'content': getContent, 'offset': indOffset}
}

let dom = items => {
    let container = document.createElement('section')
    container.id = "faqs-wrap"
    let wrap = document.createElement('div')
    wrap.id = "faqs-questions"

    container.appendChild(document.createElement('h3'))
    container.firstElementChild.innerHTML = 'FAQs'
    container.firstElementChild.id ="questions-title"
    
    wrap.appendChild(document.createElement('article'))
    
    let db = {}
    let lastN = items.length
    let elems
    let answerSpace = document.createElement('aside')
    console.log(items)

    for (var i = 1; i <= lastN; i++) {
        let item = items[i-1]

        if (!(i + 3) % 3)
            answerSpace = document.createElement('aside')
            
        possibleElems = indDom(item, answerSpace)
        elems = possibleElems ? possibleElems : elems

        db[item.id] = elems.content()
        wrap.lastElementChild.appendChild(elems.listing)

        if (!(i % 3) || i == lastN) {
            answerSpace.className = 'answer-space'
            answerSpace.id = "as" + (Math.floor(i / 3)).toString()

            wrap.lastElementChild.appendChild(answerSpace)
            answerSpace = document.createElement('aside')
        }
    }
    wrap.lastElementChild.dataset.indOffset = elems.offset
    container.appendChild(wrap)

    return container
}

module.exports.default = wrap => {
    document.body.append(dom(require('./data/faqs.json')))
}
