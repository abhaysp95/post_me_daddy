function justareturn() {
    return new Promise(() => {
        console.log("from 'justareturn'");
        return "Hi, How are you ?";
    });
}
function noreturn() {
    console.log("from 'noreturn'");
    console.log("just printing something");
}
async function retry(command) {
    return command();
}
(() => {
    retry(justareturn).then(res => {
        console.log("str1: ", res);
        if (typeof res !== "undefined") {
            console.log("str: ", res);
        }
    });
    retry(noreturn);
})();
//# sourceMappingURL=test.js.map