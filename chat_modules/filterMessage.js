let filterMessage = message => {

    if(message.trim().length == 0) return false; 
    else return message;

}

module.exports = filterMessage;