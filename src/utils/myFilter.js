export const filterTime = (t) => {
    let yyyy = new Date(t).getFullYear()
    let MM = new Date(t).getMonth()
    let dd = new Date(t).getDate()
    let HH = new Date(t).getHours()
    let mm = new Date(t).getMinutes()
    let ss = new Date(t).getSeconds()
    if (MM == 0) {
        yyyy -= 1
        MM = 12
    } else {
        MM += 1
    }
    dd = dd < 10 ? '0' + dd : dd
    mm = mm < 10 ? '0' + mm : mm
    ss = ss < 10 ? '0' + ss : ss
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}