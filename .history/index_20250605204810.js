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
  { name: "Alice" },
  { name: "Bob" },
  { name: "Anna" },
  { name: "Brian" },
];

function groupData() {
  const obj = {};
  for (let i = 0; i < data.length; i++) {
    Object.entries(data[i]).forEach(([key, value]) => {
      if (obj[value[0]]) {
        obj[value[0]].push(value);
      } else {
        obj[value[0]] = [value];
      }
    });
  }
  return obj;
}

console.log(groupData());

let a =
  '{"content":"[page 0 begin]许可项目\n手机 许可计划\n了解更多\nWi-Fi许可计划\n了解更多\n蜂窝物联网许可计划\n了解更多\n创新投入与知识产权成果\n持续创新投入是华为基业长青的基石，华为高度重视技术创新与研究，坚持将每年收入的10%以上投入到研发，过去三年，高达20%以上。GLOMO罪行啊社会去额前额为。[page 0  end][page 1 begin] 手机 与穿戴\n 手机 沙发沙发萨佛安排微软撒入啊无胚乳[page 1 end][page 2 begin]手机 许可计划\n我啊啊啊二啊飞机票委任为如哇让啊二哦啊二app奥佩容儿偶尔譬如怕我[page 2 end]","source_url":["www.baidu.com","kweweb-rhsl.huawei.com/cn/products/connectivity/smartphone-wearable.html"],"source_title":["666","手机与穿戴","手机许可计划"]}';
