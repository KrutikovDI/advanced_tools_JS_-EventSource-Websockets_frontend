
const registrationButton = document.querySelector('.registration-button');
const chatParticipants = document.querySelector('.chat-participants');
const registrationForm = document.querySelector('.registration-form');
const chatField = document.querySelector('.chat-field');
const btnMessage = document.querySelector('.btn-message');
const message = document.querySelector('.message');
const chat = document.querySelector('.chat');

function showChatField () {
    registrationForm.classList.toggle('reg')
    chatField.classList.toggle('reg')
}

function showChatParticipants (participant, user) {
    if (participant == user){
        chatParticipants.insertAdjacentHTML('beforeend', `<div class="participant red">You</div>`)
    } else {
    chatParticipants.insertAdjacentHTML('beforeend', `<div class="participant">${participant}</div>`)
    }
}


const apiURL = 'http://localhost:6060/'
registrationButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const user = document.querySelector('.registration-input');
    const request = fetch(apiURL + 'registration/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: user.value }),
    });
    const result = await request;
    if (result.status !== 200) {
        const json = await result.json();
        console.log(json)
        alert(json.status)
        user.value = '';
        return;
    }
    showChatField ()
    })


    const eventSource = new EventSource(apiURL + 'sse/');

    eventSource.addEventListener('open', (e) => {
      console.log(e);
      console.log('sse open');
    });
    
    eventSource.addEventListener('error', (e) => {
      console.log(e);
      console.log('sse error');
    });
    
    eventSource.addEventListener('message', (e) => {
      const user = document.querySelector('.registration-input');
      const dataServerSentEvents = e.data
      const parseData = JSON.parse(dataServerSentEvents)
      chatParticipants.innerHTML = '';
      console.log('это из sse: ' + user.value);
      parseData.forEach(element => showChatParticipants(element, user.value));
      console.log('sse message');
    });


const ws = new WebSocket('ws://localhost:6060/ws');

btnMessage.addEventListener('click', (e) => {
  e.preventDefault();
  const textMessage = message.value;
  ws.send(JSON.stringify({nick: userNick, text: textMessage}))
  message.value = '';
})

ws.addEventListener('open', (e) => {
  console.log(e);
  console.log('ws open');
});

ws.addEventListener('close', (e) => {
  console.log(e);
  console.log('ws close');
});

ws.addEventListener('error', (e) => {
  console.log(e);
  console.log('ws error');
});

ws.addEventListener('message', (e) => {
  console.log(e);
  const data = JSON.parse(e.data);
  data.forEach(chatConteiner => {
    if (chatConteiner.nick == userNick) {
      chat.insertAdjacentHTML('beforeend', `<div class="chat-conteiner you"><div class="information"><div class="nick">You, ${chatConteiner.date}</div></div><span class="text">${chatConteiner.text}</span></div>`)
    } else {
      chat.insertAdjacentHTML('beforeend', `<div class="chat-conteiner"><div class="information"><div class="nick">${chatConteiner.nick}, ${chatConteiner.date}</div></div><span class="text">${chatConteiner.text}</span></div>`)
    }
  });
  
  console.log('ws message');
});