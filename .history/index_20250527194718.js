
const data = [{
    'id': '1',
    "name": "John",
    "age": '24',
    "gender": "male",
    "company": "Google",
    "email": "john@gmail.com",
    "phone": "+91 1234567890",
    "address": "Mountain View, CA",
    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim"
}, {
    'id': '2',
    name: 'John',
    age: '18',
    gender: 'male',
    company: 'Google',
    email: 'john@gmail.com',
    phone: '+91 1234567890',
    address: 'Mountain View, CA',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim'

}]


const query = 'o'
const resultData = []



for (let i = 0; i < data.length; i++) {
    const key = Object.keys(data[i])
    for (let j = 0; j < key.length; j++) {
        if (data[i][key[j]].indexOf(query) !== -1) {
            if (resultData.find(item => item.id === data[i].id)) {
                continue
            }
            resultData.push(data[i])
        }
    }
}

console.log(resultData)