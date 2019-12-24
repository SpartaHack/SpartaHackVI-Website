require('./../scss/components/faqs.scss')

const request = require('request')

class FAQ {
    constructor(src, container, tabOffset) {
        this.items = []
        this.active
        this.tabOffset = tabOffset ? tabOffset : 3

        this.filterAction
        this.filterWrap
        this.wrap = this._readyDOM(container)
        this.questions = this.wrap.firstElementChild

        this.answerSpace = document.createElement('aside')
        this.answerSpace.id = 'answer-space'
        // this.answerSpace.appendChild(document.createElement('h3'))
        this.answerSpace.appendChild(document.createElement('p'))

        this.faqCount = 0
        src.forEach(srcItem => {
            let faqItem = {
                'question': srcItem.question,
                'answer': srcItem.answer,
                'listing': document.createElement('div'),
                'pos': ++this.faqCount
            }

            faqItem.listing.appendChild(document.createElement('h4'))
            faqItem.listing.firstElementChild.innerHTML = faqItem.question
            faqItem.listing.class="question-wrap"

            faqItem.listing.tabIndex = this.tabOffset + this.faqCount
            faqItem.listing.addEventListener('click', 
                () => this.enterQuestion(faqItem))
            this.wrap.appendChild(faqItem.listing)

            this.items.push(faqItem)
        })
        this._getFaq()
        // console.log(this)
    }

    enterQuestion(faqItem) {
        this.close()

        this.active = faqItem.listing
        this.active.classList.add('active-listing')

        this.answerSpace.lastElementChild.innerHTML = faqItem.answer
        this.answerSpace.lastElementChild.dataset.question = faqItem.question

        let insertBefore
        for (var i = faqItem.pos - 1; i < this.faqCount; ++i) {
            if (this.items[i].listing.offsetTop != faqItem.listing.offsetTop) {
                insertBefore = i
                break
            }
        }

        if (insertBefore)
            this.wrap.insertBefore(this.answerSpace, this.items[insertBefore].listing)
        else 
            this.wrap.appendChild(this.answerSpace)        
    }

    close () { 
        // if (this.wrap.contains(this.answerSpace))
        if (!this.active) return
        console.log(this.active)
        let wasActive = this.active
        this.active = undefined
        wasActive.classList.remove('active-listing')
        this.wrap.removeChild(this.answerSpace)
        return wasActive
    }

    startFilter() {
        if (!this.filterWrap) return

        let revert = () => {
            this.resetFilter()
            this.filterAction.classList = 'fas fa-search'


            this.filterAction.removeEventListener('click', revert)
            this.filterAction.addEventListener('click', go)

            this.filterWrap.firstElementChild.value = ''
            this.filterWrap.replaceChild(this.filterWrap.firstElementChild, this.filterWrap.firstElementChild)
            this.filterWrap.replaceChild(this.filterAction, this.filterWrap.lastElementChild)
        }
        let go = () => {
            this.filter(this.filterWrap.firstElementChild.value)
            this.filterAction.className = 'fas fa-times'

            this.filterAction.removeEventListener('click', go)
            this.filterAction.addEventListener('click', revert)

            this.filterWrap.replaceChild(this.filterAction, this.filterWrap.lastElementChild)
        }

        this.filterAction.addEventListener('click', go)
        
        this.filterWrap.firstElementChild.addEventListener('keyup', 
            e => { if (e.keyCode === 13) go() } )
    }
    filter(query) {
        if (typeof query !== "string" && query !== undefined) return
        if (!query || query.length == 0) this.resetFilter()
        if (!query || query.length < 2) return
        this.close()
        
        let found = 0
        let first
        this.items.forEach(i => {
            if (i.question.indexOf(query) !== -1 || i.answer.indexOf(query) !== -1) {
                i.listing.classList.remove('filtered-out')
                i.listing.classList.add('filtered-in')
                ++found

                if (!first) {
                    i.listing.scrollIntoView()
                    first = i
                }
            }
            else {
                i.listing.classList.remove('filtered-in')
                i.listing.classList.add('filtered-out')
            }
        })

        if (!found) window.setTimeout(
            () => this.resetFilter(), 500)
        return found
    }

    resetFilter() {
        this.items.forEach(i => {
            i.listing.classList.remove('filtered-out')
            i.listing.classList.remove('filtered-in')  
        })
    }

    _readyDOM(container) {
        let append
        if (!container) {
            container = document.createElement('section')
            container.id = "faqs-wrap"
            append = true
        }

        let wrap = document.createElement('div')
        wrap.id = "faqs-questions"
    
        wrap.appendChild(document.createElement('div'))
        wrap.firstElementChild.id ="faqs-header"
        wrap.firstElementChild.appendChild(document.createElement('h3'))
        wrap.firstElementChild.firstElementChild.innerHTML = 'FAQs'
        wrap.firstElementChild.firstElementChild.id ="questions-title"

        this.filterWrap = document.createElement('span')
        this.filterWrap.appendChild(document.createElement('input'))
        this.filterWrap.firstElementChild.placeholder = "Filter FAQs"
        
        this.filterAction = document.createElement('i')
        this.filterAction.className = 'fas fa-search'
        this.filterWrap.appendChild(this.filterAction)

        wrap.firstElementChild.appendChild(this.filterWrap)
        this.startFilter()


        wrap.appendChild(document.createElement('article'))
        // wrap.firstElementChild.tabIndex = -1
        container.appendChild(wrap)

        if (append) document.body.appendChild(container)
        return wrap.lastElementChild

    }

    _getFaq() {
        let importRq = {
            headers: {
                "Content-Type":"application/json",
                "Access-Control-Allow-Origin": "http://api.elephant.spartahack.com/",
            },
            url: "http://api.elephant.spartahack.com/faqs",
            json: true
        }

        let importApp = (err, response, body) => {
            if (response && response.statusCode === 200) {
                console.log(body)
            }
        }

        request.get(importRq, importApp)
    
    }
}

module.exports.default = FAQ