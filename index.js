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
        const cardid = 'card' + document.querySelector('#cards').childElementCount;
        //card div넣기
        const div = document.createElement('div');
        div.className = 'card' + document.querySelector('#cards').childElementCount;
        document.querySelector('#cards').append(div);

        //이미지 넣기
        var img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w500${this._poster_path}`;
        div.appendChild(img);

        //카드 배경 넣기
        const backdiv = document.createElement('div');
        backdiv.className = 'card-body';
        const cardtitlediv = document.createElement('h5');
        cardtitlediv.className = 'card-title';
        cardtitlediv.innerText = `${this._title}`;
        cardtitlediv.append(backdiv);

        document.querySelector('#card' ).append(backdiv);
        let temp = `
        <div class="card">
            <img src="https://image.tmdb.org/t/p/w500${this._poster_path}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">${this._title}</li>
                <li class="list-group-item">${this._title}</li>
                <li class="list-group-item">${this._vote_average}</li>
            </ul>
        </div>`
    }
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Y2QxMjBmOWM1ODIyZjgxYjc1YTA5N2EzNjE2ZDYwMiIsInN1YiI6IjY2Mjc5NzJmMjU4ODIzMDE3ZDkzY2ZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._2CB0nFrVZux6CYYI-LZAg1Gk3nJbR-cNgNurb8n4TY'
    }
};

const getData = async function () {
    const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    const data = await response.json();

    const movieDatasArr = [];
    const md = {};

    for (const movie of data['results']) {
        const temp = new movieDatas(movie['title'], movie['overview'], movie['poster_path'], movie['vote_average'])
        movieDatasArr.push(temp);
    }

    return movieDatasArr;
}

const print = async function () {
    const data = await getData();
    data.forEach(item => {
        item.makeCard();
        console.log(item);
    });

}

print();