module.exports.select = (src, dest) =>
    src.addEventListener('change', () => dest[src.dataset.out] = src.value)
    
module.exports.birthday = (src, dest) =>
    src.addEventListener('change', () => {
        dest['birth_year'] = src.value.substr(0,4)
        dest['birth_month'] = src.value.substr(5,2)
        dest['birth_day'] = src.value.substr(8,2)
    })