
const data = [{
    "name": "John",
    "age": '24',
    "gender": "male",
    "company": "Google",
    "email": "john@gmail.com",
    "phone": "+91 1234567890",
    "address": "Mountain View, CA",
    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim"
}, {
    name: 'John',
    age: '18',
    gender: 'male',
    company: 'Google',
    email: 'john@gmail.com',
    phone: '+91 1234567890',
    address: 'Mountain View, CA',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'
}]


const query = 'mountain'
const resultData = []



for (let i = 0; i < data.length; i++) {
    const key = Object.keys(data[i])
    for (let j = 0; j < key.length; j++) {
        if (data[i][key[j]].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            resultData.push(data[i])
            break
        }
    }
}

console.log(resultData)