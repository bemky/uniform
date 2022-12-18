export default function pick (obj, ...keys) {
    const result = {}
    Object.keys(keys).forEach(key => {
        result[key] = obj[key]
    })
    return result
}