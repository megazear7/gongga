export const wait = async function(seconds) {
    return waitMs(seconds * 1000);
}

export const waitMs = async function(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export const random = function(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}
