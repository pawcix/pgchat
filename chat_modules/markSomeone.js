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
        }
    }
};

module.exports = markSomeone;
