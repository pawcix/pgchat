let markSomeone = (msgElements, data) => {
    if (
        typeof data.msgData.marked != "undefined" &&
        data.msgData.marked.length > 0
    ) {
        let marked = data.msgData.marked;
        if (
            marked.find(el => {
                return el === "@" + username;
            })
        ) {
            msgElements.msgBox.classList.add("marked");
            let msg = data.message;
            let splitted = msg.split("@"+username);

            data.message = '';

            for(let i = 0; i<splitted.length; i++) {
                if(i == splitted.length-1) data.message += splitted[i];
                else data.message += splitted[i] + '<span class="marked-username">@' + username + '</span>';
            }
            
        }
    }
};

module.exports = markSomeone;
