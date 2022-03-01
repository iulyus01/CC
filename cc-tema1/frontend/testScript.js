var container;
document.addEventListener("DOMContentLoaded", () => {
    container = document.querySelector('.container');
    makeRequests();
});

async function makeRequests() {
    const batches = 2;
    const parralelRequestsNr = 5;
    for(let i = 0; i < batches; i++) {
        let promises = [];
        for(let j = 0; j < parralelRequestsNr; j++) {
            promises.push(fetch('http://127.0.0.1:8126/data'));
        }

        await Promise.all(promises);
        
        console.log(`sent ${batches * parralelRequestsNr} parallel requests`);
    }
    
    const url = 'http://127.0.0.1:8127/metrics';
    let response = await fetch(url).then(response => response.json());
    
    let avg = response.map(r => r.delay).reduce((s1, el) => s1 + el, 0) / response.length;
    document.querySelector('.nr').innerHTML = response.length;
    document.querySelector('.avg-delay').innerHTML = Math.round(avg * 100) / 100 + 'ms';
}

