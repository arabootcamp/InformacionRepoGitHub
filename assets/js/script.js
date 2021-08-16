//1. Crear tres funciones, una request, otra getUser y por último una función getRepo,todas deben implementar async..await
let request = async (call, user = '', numPage = 0, numRepos = 0) => {
  const URL_BASE = 'https://api.github.com/users/';
  let url;
  switch (call) {
    case 'getUser':
      url = `${URL_BASE}${user}`;
      break;
    case 'getRepo':
      url = `${URL_BASE}${user}/repos?page=${numPage}&per_page=${numRepos}`;
      break
  }
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(`Tipo de error al conectar a la API Git:  ${err}`);
  }
}

let getUser = async (user) => {
  let result = await request('getUser', user);
  return result;
}

let getRepo = async (user, numPage, numRepos) => {
  let result = await request('getRepo', user, numPage, numRepos);
  return result;
};

//2. Agregar una escucha (addEventListener) al formulario
//3. Mediante la implementación de una Promesa, realizar el llamado a las dos funciones al mismo tiempo que permiten conectarse con la API y traer la información en el caso de existir “getUser” y “getRepo”.
let getDataForm = () => {
  let dataForm = {};
  dataForm.user = document.getElementById('user').value;
  dataForm.numPage = document.getElementById('page').value;
  dataForm.numRepos = document.getElementById('repos').value;
  return dataForm;
}
let eventForm = (event) => {
  event.preventDefault();
  let dataForm = getDataForm();
  //Ejecutar promesas en paralelo.
  Promise.all([
    new Promise((resolve, reject) => {
      resolve(getUser(dataForm.user));
    }),
    new Promise((resolve, reject) => {
      resolve(getRepo(dataForm.user, dataForm.numPage, dataForm.numRepos));
    })
  ]).then((data) => {
    if (data[0].message == 'Not Found') {
      result01.innerHTML = '';
      result02.innerHTML = '';
      alert("El usuario no existe.");
    } else {
      result01.innerHTML = `
      <h4 class="mb-3">Datos Usuario</h4>
      <img class="mb-3" src="${data[0].avatar_url}" alt="avatar">
      <p class="py-0 my-0"><strong>Nombre de usuario:</strong> ${data[0].name}</p>
      <p class="py-0 my-0"><strong>Nombre de login:</strong> ${data[0].login}</p>
      <p class="py-0 my-0"><strong>Cantidad de repositorios:</strong> ${data[0].public_repos}</p>
      <p class="py-0 my-0"><strong>Localidad:</strong> ${data[0].location}</p>
      <p class="py-0 my-0"><strong>Tipo de usuario:</strong> ${data[0].type}</p>`;
      console.log(data[1])
      let text = '';
      text = `<h4 class="mb-3">Nombre de repositorios</h4>`;
      for (let obj of data[1]) {
        text += `<a class="d-block text-decoration-none" target="_blank" href="${obj['clone_url']}">${obj['name']}</a>`;
      }
      result02.innerHTML = text;
    }
  })
}
//MAIN
let form = document.getElementById('form');
form.addEventListener('submit', eventForm);