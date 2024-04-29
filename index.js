class movieManager {
    constructor(currPage, maxPage, currMaxPage, allData, dataForShow, quantity) {
        this._currPage = 0;
        this._maxPage = null;
        this._currMaxPage = 1;
        this._allData = [];
        this._dataForShow = [];
        this._quantity = 1;
    }

    get currPage() {
        return this._currPage;
    }
    set currPage(value) {
        this._currPage = value;
    }
    get maxPage() {
        return this._maxPage;
    }
    set maxPage(value) {
        this._maxPage = value;
    }
    get currMaxPage() {
        return this._currMaxPage;
    }
    set currMaxPage(value) {
        if (this._currMaxPage > value)
            return;

        this._currMaxPage = value;
    }
    get allData() {
        return this._allData;
    }
    set allData(value) {
        this._allData = value;
    }
    get dataForShow() {
        return this._dataForShow;
    }
    set dataForShow(value) {
        this._dataForShow = value;
    }
    get quantity() {
        return this._quantity;
    }
    set quantity(value) {
        this._quantity = value;
    }
}

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
                    <p class="card-vote">평점 : ${this._vote_average}</p>
                </div>
        </div>
        `

        document.querySelector('#cards').insertAdjacentHTML('beforeend', carddata);
    }
}

const MM = new movieManager();

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Y2QxMjBmOWM1ODIyZjgxYjc1YTA5N2EzNjE2ZDYwMiIsInN1YiI6IjY2Mjc5NzJmMjU4ODIzMDE3ZDkzY2ZhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._2CB0nFrVZux6CYYI-LZAg1Gk3nJbR-cNgNurb8n4TY'
    }
};

//해당 페이지 api 받기
const getData = async function (pages) {
    if (MM.currMaxPage > pages) {

        return;
    }
    MM.currMaxPage++;
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pages}`, options);
    const data = await response.json();
    MM.maxPage = data['total_pages'];
    const dataarr = [];

    for (const movie of data['results']) {
        const temp = new movieDatas(movie['title'], movie['overview'], movie['poster_path'], movie['vote_average'], movie['id'])
        dataarr.push(temp);
    }
    MM.allData.push(dataarr);
}

//출력
const print = async (pages) => {
    console.log(document)
    for (let i = 0; i < MM.quantity; i++) {
        await getData(pages + i);
        MM.currPage = pages + i;
        console.log(MM.currPage);
    }

    MM.dataForShow = [];
    for (let i = MM.currPage - MM.quantity; i < MM.currPage; i++) {
        MM.allData[i].forEach(item => {
            MM.dataForShow.push(item)
        });
    }
    count = 0;
    MM.dataForShow.forEach(item => {
        item.makeCard(count);
        count++;
    });

    await awake();
    giveCardEvent();
}

//실행될 때 한번 실행될 코드 (이벤트 붙이기 등)
const awake = async () => {
    //페이지 켜질 때 검색창 이벤트
    document.getElementById("input").focus();
    document.getElementById("input").addEventListener('keydown', event => {
        if (event.code == 'Enter')
            search();
    });
}

//카드 이벤트
const giveCardEvent = () => {
    for (let i = 0; i < document.getElementById('cards').childElementCount; i++) {
        document.getElementById(`cardbutton${i}`).addEventListener('click', function (event) {
            alert(`영화 id : ${MM.dataForShow[i]['id']}`);
        })
    }
}

//이전 페이지
const beforeList = function () {
    document.querySelector('#cards').innerHTML = '';
    if (MM.currPage - MM.quantity * 2 < 1) {
        MM.currPage = 1;
    } else {
        MM.currPage = MM.currPage - (MM.quantity * 2 - 1);
    }
    print(MM.currPage);
    document.querySelector('#currPage').innerHTML = '';
    giveCardEvent();
}

//다음 페이지
const nextList = function () {
    document.querySelector('#cards').innerHTML = '';
    if (MM.currPage < MM.maxPage - MM.quantity) {
        MM.currPage++;
    } else {
        MM.currPage = MM.maxPage - MM.quantity
    }
    print(MM.currPage);
    document.querySelector('#currPage').innerHTML = '';
    giveCardEvent();
}

//검색용 
const search = function () {
    document.querySelector('#cards').innerHTML = '';
    const searchedWord = document.querySelector('#input').value;
    console.log(searchedWord);
    if (searchedWord == '') {
        print(MM.currPage - (MM.quantity - 1));
        return;
    }
    let count = 0;
    MM.dataForShow = [];
    document.querySelector('#cards').innerHTML = '';

    MM.allData.forEach(item => {
        item.forEach(item2 => {
            let str1 = item2.title.toUpperCase();
            let str2 = searchedWord.toUpperCase();
            if (str1.search(str2) !== -1) {
                MM.dataForShow.push(item2);
            }
        })
    });

    MM.dataForShow.forEach(item => {
        item.makeCard(count);
        count++;
    });

    giveCardEvent();
}

//이름정렬
const namesort = function () {
    MM.dataForShow.sort((a, b) => {
        if (a['title'] < b['title'])
            return -1;
        if (a['title'] > b['title'])
            return 1;
        if (a['title'] === b['title'])
            return 0;
    });
    let count = 0;

    document.querySelector('#cards').innerHTML = '';
    MM.dataForShow.forEach(item => {
        item.makeCard(count);
        count++;
    });
    giveCardEvent();
}

//평점 정렬
const votesort = function () {
    MM.dataForShow.sort((a, b) => {
        if (a['vote_average'] < b['vote_average'])
            return 1;
        if (a['vote_average'] > b['vote_average'])
            return -1;
        if (a['vote_average'] === b['vote_average'])
            return 0;
    });
    let count = 0;

    document.querySelector('#cards').innerHTML = '';
    MM.dataForShow.forEach(item => {
        item.makeCard(count);
        count++;
    });
    giveCardEvent();
}

//평점 8.35점 이상만
const vote835 = () => {
    let datas;
    const vote = document.querySelector('#input').value;
    datas = MM.dataForShow.filter((data) => data.vote_average >= vote)

    console.log(datas);
    let count = 0;

    document.querySelector('#cards').innerHTML = '';
    datas.forEach(item2 => {
        item2.makeCard(count);
        count++;
    });
    giveCardEvent();
}



//한 페이지당 보이는 갯수
const changeQuantity = count => {
    if (count === 1) {
        document.querySelector('#cards').innerHTML = '';
        MM.currPage -= (MM.quantity - 1);
        MM.quantity = 1;
        print(MM.currPage);
        console.log("1");
    }
    if (count === 2) {
        document.querySelector('#cards').innerHTML = '';
        MM.currPage -= (MM.quantity - 1);
        MM.quantity = 2;
        print(MM.currPage);
        console.log("2");
    }
    if (count === 4) {
        document.querySelector('#cards').innerHTML = '';
        MM.currPage -= (MM.quantity - 1);
        MM.quantity = 4;
        print(MM.currPage);
        console.log("4");
    }
}

print(1, MM.quantity);