class movieDatas {
    constructor(title, overview, poster_path, vote_average) {
        this._title = title;
        this._overview = overview;
        this._poster_path = poster_path;
        this._vote_average = vote_average;
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

    makeCard(count) {
        //card div넣기
        const carddata = `
        <div id="card"class="card">
            <img class="movieimg" src="https://image.tmdb.org/t/p/w500${this._poster_path}">
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

// const searchInput = document.querySelector('#input');
// console.log(searchInput);

// searchInput.addEventListener("input", (e) => {
//     const value = e.target.value.toLowerCase();
// });

//api 받기
const getData = async function (pages = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pages}`, options)
    const data = await response.json();

    const movieDatasArr = [];
    const md = {};

    for (const movie of data['results']) {
        const temp = new movieDatas(movie['title'], movie['overview'], movie['poster_path'], movie['vote_average'])
        movieDatasArr.push(temp);
    }

    return movieDatasArr;
}
//출력
const print = async (pages) => {
    const data = await getData(pages);
    data.forEach(item => {
        item.makeCard();
    });
}

const movieManager = () => {

    print();
};

movieManager();