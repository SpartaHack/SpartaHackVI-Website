require('./../scss/components/faqs.scss')
const req = require('./req')

class FAQ {
    constructor(container, tabOffset) {
        this.items = []
        this.active
        this.tabOffset = tabOffset ? tabOffset : 0

        this.filterAction
        this.filterWrap
        this.wrap = this._readyDOM(container)
        this.questions = this.wrap.firstElementChild

        this.answerSpace = document.createElement('aside')
        this.answerSpace.id = 'answer-space'
        this.answerSpace.appendChild(document.createElement('p'))

        this.faqCount = 0
        this._getFaq()
    }

    get searchIcon() {
        let icon = document.createElement('i')
        icon.className = 'fas fa-search'
        icon.id = 'faq-filter-action'
        return icon
    }

    get clearIcon() {
        let icon = document.createElement('i')
        icon.className = 'fas fa-times'
        icon.id = 'faq-filter-action'
        return icon
    }

    questionClick(question) {
        if (question.listing != this.active)
            this.enterQuestion(question)
        else this.close()
    }

    enterQuestion(faqItem) {
        if (this.active) this.active.className = ''
        this.active = faqItem.listing
        this.active.className = 'active-listing'

        this.answerSpace.lastElementChild.innerHTML = faqItem.answer
        this.answerSpace.lastElementChild.dataset.question = faqItem.question

        let insertBefore
        for (var i = faqItem.pos + 1; i < this.faqCount; i++) {
            if (this.items[i].listing.offsetTop != faqItem.listing.offsetTop) {
                insertBefore = i
                break
            }
        } 
        if (insertBefore)
            this.wrap.insertBefore(this.answerSpace, this.items[insertBefore].listing)
        else 
            this.wrap.appendChild(this.answerSpace) 
            
        
        let close = () => {
            window.removeEventListener('resize', close)
            this.close()
        }
        window.addEventListener('resize', close)
    }

    close () { 
        if (!this.active) return
        this.active.className = ''
        
        this.answerSpace = this.wrap.removeChild(this.answerSpace)
        this.active = false
    }

    startFilter() {
        if (!this.filterWrap) return
    
        let revert = () => {
            this.resetFilter()
            this.filterAction.firstElementChild.replaceWith(this.searchIcon)

            this.filterWrap.firstElementChild.value = ''
            this.filterWrap.replaceChild(this.filterWrap.firstElementChild, this.filterWrap.firstElementChild)

            this.filterAction = this.filterWrap.lastElementChild
            this.filterAction.removeEventListener('click', revert)
            this.filterAction.addEventListener('click', go)
        },
        go = () => {
            this.filter(this.filterWrap.firstElementChild.value)
            this.filterAction.firstElementChild.replaceWith(this.clearIcon)
            this.filterAction.removeEventListener('click', go)
            this.filterAction.addEventListener('click', revert)

        }

        this.filterWrap.removeChild(this.filterWrap.firstChild)
        this.filterAction.addEventListener('click', go)

        this.filterWrap.firstChild.addEventListener('keyup', 
            e => { if (e.keyCode === 13) go() } )
        }
    filter(query) {
        if (typeof query !== "string" && query !== undefined) return
        if (!query || query.length == 0) this.resetFilter()
        if (!query || query.length < 2) return
        this.close()
        
        let first,
        found = 0
        this.items.forEach(i => {
            if (i.question.indexOf(query) !== -1 || i.answer.indexOf(query) !== -1) {
                i.listing.classList.remove('filtered-out')
                i.listing.classList.add('filtered-in')
                ++found

                if (!first) {
                    i.listing.focus()
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

        this.filterWrap = document.createElement('div')
        this.filterWrap.appendChild(document.createElement('input'))
        this.filterWrap.firstChild.for = "faq-filter"
        this.filterWrap.appendChild(document.createElement('input'))
        this.filterWrap.lastElementChild.placeholder = "Filter FAQs"
        this.filterWrap.lastElementChild.id = "faq-filter"
        
        this.filterAction = this.searchIcon
        this.filterWrap.appendChild(document.createElement('span'))
        this.filterWrap.lastChild.appendChild(this.filterAction)
        this.filterAction = this.filterWrap.lastChild

        wrap.firstElementChild.appendChild(this.filterWrap)
        this.startFilter()

        wrap.appendChild(document.createElement('article'))
        wrap.lastChild.tabIndex = 0
        container.appendChild(wrap)

        if (append)
            document.body.appendChild(container)
        return wrap.lastElementChild

    }

    _getFaq() {
        let importRq = {
            headers: {
                "Content-Type":"application/json"
            },
            url: req.base+"/faqs",
            json: true
        }

        let importApp = (err, response, body) => {
            if (response && response.statusCode === 200)
                body.forEach(srcItem => {
                    if (srcItem.placement == "home") 
                        this.items.push({
                            'question': srcItem.question,
                            'answer': srcItem.answer,
                            'priority': srcItem.priority,
                            'listing': document.createElement('div')
                        })
                })

                this.items.sort((e1, e2) => 
                    e1.priority > e2.priority ? 1 :
                    (e1.priority < e2.priority ? -1 : 0) )
                
                let count = 0
                this.items.forEach(i => {
                    i.listing.appendChild(document.createElement('h4'))
                    i.listing.firstElementChild.innerHTML = i.question
                    i.listing.class="question-wrap"
        
                    i.listing.tabIndex = this.tabOffset
                    this.wrap.appendChild(i.listing)

                    i.pos = count++
                    i.listing.addEventListener('click', 
                        () => this.questionClick(i))
                    i.listing.addEventListener('keyup', e => {
                        if (e.keyCode == 9 || e.keyCode == 32)
                            this.questionClick(i)
                    })
                })
                this.faqCount = count
        }

        req.uest.get(importRq, importApp)
    }
}

module.exports.default = FAQ