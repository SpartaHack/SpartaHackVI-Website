class ScheduleItem {
    constructor(attributes, locations) {
        this.location

        this.title
        this.description
        this.occurence
        this.lastUpdated
    }

    parseTime(time) {
        return new Time(time)
    }

    get isSoon() {
        if (!(this.occursAt instanceof Date))
            console.error('Item occurance not set')

        let now = new Date()
        return (Math.round(Math.abs(now - this.occursAt)/1000/3600))
            ? false : true
        
    }
    
    get location() {}

    get locationTitle() {}

    makeListing() {
        let listing = document.createElement('ul'),
        title = document.createElement('h3'),
        locationTitle = document.createElement('h4')
    }
}