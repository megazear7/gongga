import { listen } from "./io.js";

const test = await listen({
    on: key => console.log('Recieved: ' + key)
});

console.log(test);
