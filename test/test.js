let myToken = undefined

fetch('http://localhost:8003/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'test',
    password: 'test'
  })
})
.then(response => {
  return response.json();
})
.then(data => {
  myToken = data.token
  console.log('Odebrane dane:', data);
})
.catch(error => {
  console.error('Wystąpił błąd:', error);
});


setTimeout(() => {
  console.log(myToken)
  fetch('http://localhost:8003/verify-test', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${myToken}`,
      'Content-Type': 'application/json'
    }
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