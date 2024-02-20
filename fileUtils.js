import fs from "fs"

// const fs = require("fs");
// const JSON_FILE = "books.json"

export function readJson(JSON_PATH) {
    try {
        const jsonData = fs.readFileSync(JSON_PATH);
        const data =  JSON.parse(jsonData);
        return data
    } catch (error) {
        console.log(error);

    }
}

export function updateJson(newData, JSON_PATH) {
    try {
        const data = JSON.stringify(newData);
        const newJson = fs.writeFileSync(JSON_PATH, data);
        return newJson;
    } catch (error) {
        console.log(error);

    }
}


/*
console.log('Hola Carlos');
console.log(process.argv);
*/

/*
const sum = (a, b) => parseInt(a) + parseInt(b);

const substract = (a, b) => a - b;

const newArgs = process.argv.slice(2);

console.log(newArgs);

const n1 = newArgs[1];
const n2 = newArgs[2];

if (newArgs[0] === 'sum') {
    console.log(sum(n1, n2));
}

if (newArgs[0] === 'substract') {
    console.log(substract(n1, n2));
}
*/
