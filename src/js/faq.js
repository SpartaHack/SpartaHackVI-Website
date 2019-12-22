require('./../scss/components/faqs.scss')

class FAQ {
    constructor(src, container, tabOffset) {
        this.tabOffset = tabOffset ? tabOffset : 3
        this.wrap = this._readyDOM(container)
        this.questions = this.wrap.firstElementChild

        this.items = {}
        // this.answerSpace = document.createElement('aside')
        // this.answerSpace.appendChild(document.createElement('h3'))
        // this.answerSpace.appendChild(document.createElement('p'))

        let faqQount= 0


        src.forEach(srcItem => {
            let listing = document.createElement('div')
            listing.classList.add("listing")
            let faqItem = {
                'question': srcItem.question,
                'answer': srcItem.answer,
                'listing': listing,
                'panel': document.createElement('div'),
                'posting': document.createElement('p'),
                'pos': ++faqQount
            }

            faqItem.listing.appendChild(document.createElement('h4'))
            faqItem.listing.firstElementChild.innerHTML = faqItem.question
            faqItem.listing.class="question-wrap"

            faqItem.posting.innerHTML = faqItem.answer

            faqItem.panel.classList.add("panel")
            faqItem.panel.appendChild(faqItem.posting)

            faqItem.listing.tabIndex = this.tabOffset + faqQount
            faqItem.listing.addEventListener('click', 
                () => this.enterQuestion(faqItem))
            this.wrap.appendChild(faqItem.listing)
            this.wrap.appendChild(faqItem.panel)

            this.items[String(srcItem.id)] = faqItem
        })
    }

    enterQuestion(faqItem, answerSpace) {        
        if (faqItem.panel.style.display === "block") {
            faqItem.panel.style.display = "none";
        } else {
            faqItem.panel.style.display = "block";
        }

        if(faqItem.listing.classList.contains("active")){
            faqItem.listing.classList.remove("active")
        } else {
            faqItem.listing.classList.add("active")
        }
        
    }
    close () {
        if (this.wrap.firstElementChild != this.questions)
            this.wrap.replaceChild(this.questions, this.answerSpace)
        this.wrap.parentElement.replaceChild(this.questions, this.answerSpace)
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
    
        container.appendChild(document.createElement('h3'))
        container.firstElementChild.innerHTML = 'FAQs'
        container.firstElementChild.id ="questions-title"
        
        //wrap.appendChild(document.createElement('article'))
        //wrap.firstElementChild.tabIndex = -1
        container.appendChild(wrap)

        if (append) document.body.appendChild(container)
        return wrap

    }
}

module.exports.default = FAQ