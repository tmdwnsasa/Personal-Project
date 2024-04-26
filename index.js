class movieDatas {
    constructor(title, overview, poster_path, vote_average, id) {
        this._title = title;
        this._overview = overview;
        this._poster_path = poster_path;
        this._vote_average = vote_average;
        this._id = id;
    }

    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get overview() {
        return this._overview;
    }
    set overview(value) {
        this._overview = value;
    }
    get poster_path() {
        return this._poster_path;
    }
    set poster_path(value) {
        this._poster_path = value;
    }
    get vote_average() {
        return this._vote_average;
    }
    set vote_average(value) {
        this._vote_average = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }

    makeCard(count) {
        //card div넣기
        const carddata = `
        <div id="card"class="card">
            <button id="cardbutton${count}" class="cardbutton">
                <img class="movieimg" src="https://image.tmdb.org/t/p/w500${this._poster_path}">
            </button>
                <div class="card-body">
                    <h5 class="card-title">${this._title}</h5>
                    <p class="card-overview">${this.overview}</p>
                    <p class="card-vote">${this._vote_average}</p>
                </div>
        </div>
        `
        document.querySelector('#cards').insertAdjacentHTML('beforeend', carddata);

        // const div = document.createElement('div');
        // const cardname = 'card' + document.querySelector('#cards').childElementCount;
        // div.className = 'card';
        // div.id = cardname;
        // document.querySelector('#cards').append(div);

        // //이미지 넣기
        // var img = document.createElement("img");
        // img.src = `https://image.tmdb.org/t/p/w500${this._poster_path}`;
        // div.appendChild(img);

        // //카드 배경 넣기
        // const backdiv = document.createElement('div');
        // backdiv.className = 'card-body';

        // const cardtitlediv = document.createElement('h5');
        // cardtitlediv.className = 'card-title';
        // cardtitlediv.innerText = `${this._title}`;
        // backdiv.append(cardtitlediv);

        // const cardoverviewdiv = document.createElement('p');
        // cardoverviewdiv.className = 'card-overview';
        // cardoverviewdiv.innerText = `${this._overview}`;
        // backdiv.append(cardoverviewdiv);

        // const cardvotediv = document.createElement('p');
        // cardvotediv.className = 'card-vote';
        // cardvotediv.innerText = `${this._vote_average}`;
        // backdiv.append(cardvotediv);

        // document.querySelector('#' + cardname).append(backdiv);
        // console.log(typeof document.querySelector('#' + cardname))
    }
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Y2QxMjBmOWM1ODIyZjgxYjc1YTA5N2EzNjE2ZDYwMiIsInN1YiI6IjY2Mjc5NzJmMjU4ODIzMDE3ZDkzY2ZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._2CB0nFrVZux6CYYI-LZAg1Gk3nJbR-cNgNurb8n4TY'
    }
};

let dataSearch = [];

const search = function () {
    const searchedWord = document.querySelector('#input').value;
    let count = 0;
    console.log(dataSearch);

    dataSearch.forEach(item => {
        item.forEach(item2 => {
            let str1 = item2.title.toUpperCase();
            let str2 = searchedWord.toUpperCase();
            if (str1.search(str2) === -1) {
                document.querySelector('#cards').children[count].style.display = 'none';
            } else {
                document.querySelector('#cards').children[count].style.display = 'block';
            }
            count++;
        })
    })
}

const namesort = function () {
    for (let item of dataSearch) {
        item.sort((a, b) => {
            if (a['title'] < b['title'])
                return -1;
            if (a['title'] > b['title'])
                return 1;
            if (a['title'] === b['title'])
                return 0;
        });
    }
    let count = 0;

    document.querySelector('#cards').innerHTML= '';
    dataSearch.forEach(item => {
        item.forEach(item2 => {
            item2.makeCard(count);
            count++;
        })
    });
    awake();
}

const votesort = function () {
    for (let item of dataSearch) {
        item.sort((a, b) => {
            if (a['vote_average'] < b['vote_average'])
                return 1;
            if (a['vote_average'] > b['vote_average'])
                return -1;
            if (a['vote_average'] === b['vote_average'])
                return 0;
        });
    }
    let count = 0;

    
    document.querySelector('#cards').innerHTML= '';
    dataSearch.forEach(item => {
        item.forEach(item2 => {
            item2.makeCard(count);
            count++;
        })
    });
    awake();

}

//api 받기
const getData = async function (pages = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pages}`, options)
    const data = await response.json();
    const movieDatasArr = [];
    const md = {};

    for (const movie of data['results']) {
        const temp = new movieDatas(movie['title'], movie['overview'], movie['poster_path'], movie['vote_average'], movie['id'])
        movieDatasArr.push(temp);
    }
    dataSearch.push(movieDatasArr);
    return movieDatasArr;
}

//출력
const print = async (pages) => {
    let data = [];
    for (let i = 0; i < 1; i++) {
        data.push(await getData(i + 1));
    }
    count = 0;
    dataSearch[pages];
    data.forEach(item => {
        item.forEach(item2 => {
            item2.makeCard(count);
            count++;
        })
    });

    await awake();
    return data;
}

const awake = async () => {
    for (let i = 0; i < document.getElementById('cards').childElementCount; i++) {
        document.getElementById(`cardbutton${i}`).addEventListener('click', function (event) {
            alert(`영화 id : ${dataSearch[Math.trunc(i / 20)][i % 20]['id']}`)
        })
    }
    document.getElementById("input").focus();
    document.getElementById("input").addEventListener('keydown', event => {
        if (event.code == 'Enter')
            search();
    });
}

print();