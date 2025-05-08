let myToken = undefined

fetch('http://localhost:8003/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'misio',
    password: 'misio'
  })
})
.then(response => {
  return response.json();
})
.then(data => {
  myToken = data.token
})
.catch(error => {
  console.error('Wystąpił błąd:', error);
});


setTimeout(() => {
  fetch(`http://localhost:8001/room`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${myToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // name: 'koxy',
      id: "681cead9cc1bf412838c360e"
    })
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log('Odebrane dane:', data);
  })
  .catch(error => {
    console.error('Wystąpił błąd:', error);
  });
}, 1000)