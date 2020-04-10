const API_KEY_NEWS = '6b9e20afb8854bb48d678966f22050cb';
const API_KEY_WEATHER = 'cf1efc025cfc0a25a91176448b83d2c6';

let min = document.getElementById("min")
let sec = document.getElementById("sec")
let timer = document.getElementsByClassName("timer")[0]

let listnews = document.getElementsByClassName("list-news")[0]
let listweather = document.getElementsByClassName("list-weather")[0]

let interval

let api_is_call = false;

if (!localStorage.work) {
    localStorage.work = true
}

(() => {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=Paris&APPID=' + API_KEY_WEATHER +'&units=metric')
        .then(res => res.json())
        .then((data) => {
            if (data.cod === "200") {
                data.list.forEach(e => {
                    if (e.dt_txt.split(' ')[1] === '12:00:00') {
                        console.log(e)
                        let html = `<p>${e.dt_txt.split(' ')[0]}</p><img src="./assets/${e.weather[0].icon}@2x.png"><p>${e.main.temp}°</p>`;
                        let div = document.createElement("div")
                        div.innerHTML = html;
                        listweather.appendChild(div)
                    }
                    
                })
            }
        })
})();

(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=fr&apiKey=' + API_KEY_NEWS)
        .then(res => res.json())
        .then((data) => {
            if (data.status === "ok") {
                data.articles.forEach(news => {
                    let li = document.createElement("li")
                    li.textContent = news.title;
                    listnews.appendChild(li)
                });
            }
        })
})();

const timeUpdate = () => {
    const delta = Date.now() - Number(localStorage.start)
    if (localStorage.work === "true") {
        if (Number(delta) > 1500000) {
            localStorage.work = false
            localStorage.start = Date.now()
            alert("break ?")
        }
        timer.style.color = "red";
    } else if (localStorage.work === "false") {
        if (Number(delta) > 300000) {
            localStorage.work = true
            localStorage.start = Date.now()
            alert("work !!!")
        }
        timer.style.color = "green";
    }
    min.textContent = String(Math.floor(delta / 60000)).padStart(2, '0')
    sec.textContent = String(Math.floor(delta / 1000) % 60).padStart(2, '0')
}


if (!localStorage.start) {
    timer.addEventListener("click", () => {
        localStorage.start = Date.now()
        timeUpdate()
        clearInterval(interval)
        interval = setInterval(timeUpdate, 1000);
    })
} else {
    timeUpdate()
    clearInterval(interval)
    interval = setInterval(timeUpdate, 1000);
}