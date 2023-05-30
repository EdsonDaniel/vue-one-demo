const getData = async function(url = "", data = {}){
  const response = await fetch (url)
  .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
    return null;
  });

return response;
  /*return await fetch(baseUrl + 'prov?compr=' +comprador)
    .then(async function(response) {
      if(response.ok) {
        await response.json().then(data => {
          pro.value = data;
          return datos;
        });
      } else {
        console.log('Respuesta de red OK pero respuesta HTTP no OK');
        return {};
      }
    })
    .catch(function(error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
      return {};
    });*/
}

const getData2 = async function (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data)
    })
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
        return null;
      });
    /*if(response.ok){
        return response.json();
    }*/
    return response;
    //return null;//.json();
}

export {getData}