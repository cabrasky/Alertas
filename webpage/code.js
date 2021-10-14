const socket = io(window.location.hostname + ":80");
const groupContainer = document.getElementById('group-container')
const Container = 'container'
const SubContainer = 'sub-container'
const TittleContainer = 'tittle-container'
const userContainer = 'user'
const messageContainer = 'message-container'
const message = 'message'
const img = 'img'

setTimeout(() => {  eliminate(); }, 2000);

socket.emit('connected', "test");
console.log('You joined')

socket.on('views', function (variable) {
    console.log("reviced");
    console.log("views: " + variable)
});

socket.on('message', function (user, msg) {
    var dict = {}
    for (var i = 0; i < msg.length; i++) {
        if (msg[i].endsWith('.png')) {
            dict[i] = ({
                "type": "img",
                "content": msg[i]
            })
        } else {
            dict[i] = ({
                "type": "div",
                "content": msg[i]

            })
        }
    }
    appendMessage(user, dict, msg.length);
})

function appendMessage(user, Elements, subs) {
    const Element = document.createElement('div')
    const subElement = document.createElement('div')
    const titleElement = document.createElement('div')
    const userElement = document.createElement('div')
    const messageElement = document.createElement('div')
    const notepadImg = document.createElement('img');
    const notepadText = document.createElement('div');
    const closeImg = document.createElement('img');
    Element.className = Container
    subElement.className = SubContainer
    titleElement.className = TittleContainer
    userElement.innerText = user
    userElement.id = userContainer
    closeImg.className = "closeImg"
    closeImg.src = "/resources/close.png"
    notepadImg.className = "notepadImg"
    notepadImg.src = "/resources/notepad.png"
    
    notepadText.className = "notepadText"
    notepadText.innerHTML = "Notepad"

    var AllNewElementsHTML = ''

    for (var i = 0; i < subs; i++) {
        if (Elements[i].type == 'img') {
            var currentElement = document.createElement(Elements[i].type)
            currentElement.src = Elements[i].content
            currentElement.id = img;
            AllNewElementsHTML += currentElement.outerHTML
        } else {
            AllNewElementsHTML += Elements[i].content + " "
        }

        

    }

    messageElement.innerHTML = AllNewElementsHTML

    messageElement.id = messageContainer
    subElement.appendChild(userElement)
    subElement.appendChild(messageElement)
    titleElement.appendChild(notepadImg);
    titleElement.appendChild(notepadText)
    titleElement.appendChild(closeImg)
    Element.appendChild(titleElement);
    Element.appendChild(subElement);
    groupContainer.append(Element);



}

async function eliminate() {
    if (document.body.offsetHeight > screen.availHeight) {
    groupContainer.firstChild.remove()
    }
    
    setTimeout(() => {  eliminate(); }, 0);
};