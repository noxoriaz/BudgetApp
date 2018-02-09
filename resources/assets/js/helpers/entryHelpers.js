
import _ from 'lodash'

export const getCategories = (entries, additional) => {
    const categories = {} 
    _(_.cloneDeep(entries))
        .forEach(x => {
            if (!categories[x.category]) {
                categories[x.category] = x.category 
            }
            return x
        })
    const res = _.toArray(categories)
    if (additional) {
        res.push(additional)
    }
    return res
}
