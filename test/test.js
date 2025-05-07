let myToken = undefined

fetch('http://localhost:8003/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'misiek',
    password: 'misiek'
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
  fetch('http://localhost:8001/user/role/remove', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${myToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'sigma',
      rolename: 'chat-admin'
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