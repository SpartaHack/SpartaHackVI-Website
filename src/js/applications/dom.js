
/*
"name": {
    "input": 
        "text" (*) || "select" (^) || "date" (%) || "number" (#) ||
        --* "autocomplete-"
        --# "other-"
        ----*# list
        ------* "-paragraph--" || ""

    ,inputOpts: {
        *: 
        ^:
        %: 
        #: min, max, 
    }
    ,placeholder: ""
    ,error: ""
    ,validator: "" || bool
    ,out: "" || ["field1", "field2"]
}
*/

const makers = {
    "route": command => {
        
    },
    "text": () => {

    },
    "select": () => {

    },
    "date": () => {

    },
    "number": () => {

    }
}

const make = (director, opts) => {
    if (typeof opts != "object" || !opts.input 
        || typeof make.input == "string") return
    
    let args = opts.split("-")
    console.log(args)
    return args[-1] && makers[args[-1]] ? makers[args[-1]](args)
        : ( makers[args[0]] ? makers[args[0]](args) : undefined )
}

const getSrc = (director, links) => {
    // "FP" || [FPs] || ['./$dir', 'c1', 'c2']
    if (typeof links == "array" ) {
    if (links[-1] && links[0].substr(0,1) === ".")
        for (let i = 0; i < links.length; i++) {


    }}
    else typeof links == "string" 
        ? links : ['./applications', 'p1', 'p2', 'p3']

}