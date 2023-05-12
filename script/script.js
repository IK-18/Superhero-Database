const searchButton = document.querySelector('.search');

const randomButton = document.querySelector('.random');

const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

const accessToken = 200559295696676;

const baseUrl = `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api`;

const div = document.querySelector('.cont');

const topButton = document.querySelector('#Top');

div.style.width = '100%';

let ID = Array.from(new Array(731), (x, i) => i + 1);

let heroInfo = [];

window.onscroll = function () { scrollFunction(); };

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
}

const heroDatabase = () => {
    for (let member of ID) {
        fetch(`${baseUrl}/id/${member}.json`) //.then(response => response.json()).then(json => console.log(json.name));
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then(json => {
                if (json.name != undefined) {
                    return heroInfo.push(json);
                }
            })
            .catch((error) => console.log(error));
    }
};

const searchHero = () => {
    div.innerHTML = '';
    let search = document.querySelector('input').value.toUpperCase();
    for (let hero in heroInfo) {
        if (search != '' && search != ' ' && heroInfo[hero].name.toUpperCase().includes(search)) {
            showHeroInfo(heroInfo[hero]);
        }
    }
    if (search == ' ') {
        for (let thing in heroInfo) {
            showHeroInfo(heroInfo[thing]);
        }
    }
    if (div.innerHTML == '') {
        div.innerHTML = '<h2>Character not found!</h2>';
    }
};

const statToEmoji = {
    intelligence: '🧠',
    strength: '💪',
    speed: '⚡',
    durability: '🏋️‍♂️',
    power: '📊',
    combat: '⚔️',
};

const showHeroInfo = (character) => {
    const name = `<h2>${character.name}</h2>`;

    let img;

    if (width <= 768) {
        img = `<img src="${(character.images.sm)}"/>`;
    } else if (width > 768 && width <= 1024) {
        img = `<img src="${(character.images.md)}"/>`;
    } else if (width > 1024) {
        img = `<img src="${(character.images.lg)}"/>`;
    }

    const bio = Object.keys(character.biography).map(info => {
        return `<p>${info.toUpperCase()}: <br>${character.biography[info]}</p>`;
    }).join('');

    const looks = Object.keys(character.appearance).map(look => {
        return `<li>${look.toUpperCase()}: <br>${character.appearance[look]}<br></li>`;
    }).join('');

    const stats = Object.keys(character.powerstats).map(stat => {
        return `<li>${statToEmoji[stat]} ${stat.toUpperCase()}: ${character.powerstats[stat]}</li>`;
    }).join('');

    const connects = Object.keys(character.connections).map(group => {
        return `<li>${group.toUpperCase()}: <br>${character.connections[group]}</li>`;
    }).join('');

    const jobs = Object.keys(character.work).map(occu => {
        return `<li>${occu.toUpperCase()}: <br>${character.work[occu]}</li>`;
    }).join('');

    let hero = document.createElement('div');
    hero.style.minWidth = '50%';

    hero.style.maxWidth = '50%';

    hero.innerHTML = `${name}${img}${bio}<button class="accordion">APPEARANCE</button><ul class="panel">${looks}</ul><button class="accordion">POWERSTATS</button><ul class="panel">${stats}</ul><button class="accordion">CONNECTIONS</button><ul class="panel">${connects}</ul><button class="accordion">WORK</button><ul class="panel">${jobs}</ul>`;

    const accorDisplay = async () => {
        let acc = await document.getElementsByClassName("accordion");
        let i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    };

    accorDisplay();

    div.append(hero);
};

const enter = (event) => {
    if (event.key == 'Enter') {
        searchHero();
    }
};

const randomHero = () => {
    div.innerHTML = '';
    let randomID = Math.floor(Math.random() * 563) + 1;
    showHeroInfo(heroInfo[randomID]);
};

searchButton.addEventListener('click', searchHero);

randomButton.addEventListener('click', randomHero);

document.querySelector('input').addEventListener('keypress', enter);

heroDatabase();