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