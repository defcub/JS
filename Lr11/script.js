const header = document.querySelector('header');
const section = document.querySelector('section');

const requestURL = 'https://semegenkep.github.io/json/example.json';
const request = new XMLHttpRequest();

request.open('GET', requestURL);
request.responseType = 'json';

request.onload = function () {
    if (request.status !== 200 || request.response === null) {
        header.textContent = `Could not load the squad data (HTTP ${request.status}).`;
        return;
    }

    const superHeroes = request.response;
    console.log(superHeroes);

    populateHeader(superHeroes);
    showHeroes(superHeroes);
};

request.onerror = function () {
    header.textContent = 'Network error. Could not reach the squad data.';
};

request.send();

function populateHeader(squad) {
    const title = document.createElement('h1');
    title.textContent = squad.squadName;

    const details = document.createElement('p');
    details.textContent = `Hometown: ${squad.homeTown} // Formed: ${squad.formed}`;

    header.append(title, details);
}

function showHeroes(squad) {
    squad.members.forEach(function (hero) {
        const card = document.createElement('article');

        const name = document.createElement('h2');
        name.textContent = hero.name;

        const identity = document.createElement('p');
        identity.textContent = `Secret identity: ${hero.secretIdentity}`;

        const age = document.createElement('p');
        age.textContent = `Age: ${hero.age}`;

        const powersLabel = document.createElement('p');
        powersLabel.textContent = 'Superpowers:';

        const powersList = document.createElement('ul');

        hero.powers.forEach(function (power) {
            const item = document.createElement('li');
            item.textContent = power;
            powersList.appendChild(item);
        });

        card.append(name, identity, age, powersLabel, powersList);
        section.appendChild(card);
    });
}