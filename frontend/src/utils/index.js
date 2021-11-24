export const axiosJWTHeader = (jwt) => {
    return {
        Authorization: "Bearer " + jwt
    }
}

export const transformArr = (arr) => {
    let newArr = [];
    for(const elem of arr) {
        newArr.push({name: elem.state, href: '/'})
    }
    return newArr;
}

export const checkObjectEquality = (obj1, obj2) => {
    for(const key in obj1) {
        if(obj1[key] != obj2[key])
            return false
    }
    return true
}