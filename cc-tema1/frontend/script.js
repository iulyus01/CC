function buttonClick() {
    document.querySelector('.loader').classList.remove('hidden');
    fetchText();
}

async function fetchText() {
    const url = 'http://127.0.0.1:8126/data';
    let response = await fetch(url).then(response=>response.json());

    console.log(response);

    document.querySelector('#info-ip').innerHTML = response.ip;
    document.querySelector('#info-continent').innerHTML = response.continent_name;
    document.querySelector('#info-country').innerHTML = response.country_name;
    document.querySelector('#info-region').innerHTML = response.region;
    document.querySelector('#info-time').innerHTML = response.localtime;

    document.querySelector('.loader').classList.add('hidden');
}

document.addEventListener("DOMContentLoaded", () => {

});