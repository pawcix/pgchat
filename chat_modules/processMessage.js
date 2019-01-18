const markSomeone = require("./markSomeone");

let processMessage = (msgElements, data) => {

    markSomeone(msgElements, data);
    
};

module.exports = processMessage;
