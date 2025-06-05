
// const data = [{
//     "name": "John",
//     "age": '24',
//     "gender": "male",
//     "company": "Google",
//     "email": "john@gmail.com",
//     "phone": "+91 1234567890",
//     "address": "Mountain View, CA",
//     "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim"
// }, {
//     name: 'John',
//     age: '18',
//     gender: 'male',
//     company: 'Google',
//     email: 'john@gmail.com',
//     phone: '+91 1234567890',
//     address: 'Mountain View, CA',
//     about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
// }]


// const query = 'mountain'
// let resultData = []



// // for (let i = 0; i < data.length; i++) {
// //     const key = Object.keys(data[i])
// //     for (let j = 0; j < key.length; j++) {
// //         if (data[i][key[j]].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
// //             resultData.push(data[i])
// //             break
// //         }
// //     }
// // }
// resultData = data.filter((item) => {
//     const values = Object.values(item)
//     for (let j = 0; j < values.length; j++) {
//         if (values.includes(query)) {
//             return item
//         }
//     }
// })

// console.log(resultData)


// const data = [
//     { name: 'John', age: 24, company: 'Google' },
//     { name: 'Alice', age: 30, company: 'Amazon' },
//     { name: 'Tom', age: 26, company: 'Google' }
// ];

// function searchByFields(data, str, arr) {
//     return data.filter((item) => {
//         const keys = Object.keys(item).filter(key => arr.includes(key))
//         for (let i = 0; i < keys.length; i++) {
//             if (String(item[keys[i]]).toLowerCase().includes(String(str).toLowerCase())) {
//                 return item
//             }
//         }
//     })
// }


// console.log(searchByFields(data, 'Amazon', ['company']))


// const data = [
//     { name: 'Alice', age: 24, gender: 'female' },
//     { name: 'Bob', age: 30, gender: 'male' },
//     { name: 'Eve', age: 24, gender: 'female' }
// ];

// const conditions = { age: 24, gender: 'female' };

// function filterByConditions(data, conditions) {
//     return data.filter((item) => {
//         return Object.entries(conditions).every(([key, value])=>{
//             return item[key] === value
//         })
//     })
// }


// console.log(filterByConditions(data, conditions));




const data = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Anna' },
    { name: 'Brian' }
];
bj
function groupData() {
    const obj = {}
    Object.entries(data).forEach(([key, value]) => {
        if (obj[key[0]]) {
            obj[key[0]].push(value)
        } else {
            obj[key[0]] = [value]
        }
    })
    return o
}

groupData()