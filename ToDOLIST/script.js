// import html from "./core.js";

// const cars = ['Mercedes', 'Porsche', 'BMW']
// const isSuccess = true
// const output = html`
//     <h1>${0}<h1>
//     <ul>
//         ${cars.map((car) => `<li>${car}</li>`).join('')}
//     </ul>
// `

// console.log(output)

function test(arr,...rest) {
    console.log( rest)
}


const obj = {
    a: 5,
    b: {
        c: 8
    },
    d: 9
}

const testResult = test(1, 2, 2, 3, 4, 5)

