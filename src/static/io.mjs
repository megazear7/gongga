import rlp from 'readline';
import fs from 'fs';

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();

const rl = rlp.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function ask(msg) {
    return new Promise(resolve => {
        rl.question(msg, input => resolve(input));
    });
}

export async function listen(listener) {
    stdin.on('data', key => {
        if (key === '\u0003') {
            process.exit();
        } else {
            listener.on(JSON.stringify(key));
        }
    });
}

export function readAfter(wait = 1000) {
    const start = Date.now();
    const promise = new Promise(resolve => {
        setTimeout(() => resolve(''), wait);
        rl.question('', input => resolve(input))
    });
    return promise;
}

export function close() {
    rl.close();
}
