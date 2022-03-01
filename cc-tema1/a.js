
const { promises: { readFile } } = require("fs");

async function a() {
    await readFile("app.js").then(fileBuffer => {
        console.log(fileBuffer.toString());
    }).catch(error => {
        console.error(error.message);
        process.exit(1);
    });
}

console.log('a1');
a()
console.log('a2');