class Scheduler {
    constructor() {
        this.scheduleName
    }

    get scheduleArea() {
        if (this.dom) return this.dom

        let itemArea = this.domNames('section', 'schedule-container'),
        itemWrap = this.domNames('div', 'schedule-wrap'),
        itemList = this.domNames('ul', 'schedule-list'),
        title = this.domNames('h3', 'schedule-title')

        title.innerHTML = this.scheduleName
        itemArea.appendChild(title)
        itemArea.appendChild(itemWrap)
        itemArea.appendChild(itemList)
    }

    domNames(target, base, nodeType) {
        if (typeof target == "string")
            target = document.createElement(nodeType)
        if (!(target instanceof HTMLElement))
            console.error('Must be element or element type')

        target.className = base
        target.id = this.scheduleName + "-" + base
        return target
    }
    updateEvents() {

    }
    
    getLocationEvemnts() {

    }

    getEventsUntil() {

    }

    getEvents(count) {

    }
}
