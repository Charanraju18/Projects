const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'
const TRAILER_API = 'https://api.themoviedb.org/3/movie/MOVIE_ID/videos?api_key=3fd2be6f0c70a2a598f084ddfb75487c'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const popup = document.getElementById('popup')
const popupTitle = document.getElementById('popup-title')
const popupVideo = document.getElementById('popup-video')
const closePopup = document.getElementById('close-popup')

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
    showMovies(data.results)
}

function showMovies(movies) {
    main.innerHTML = ''
    movies.forEach((movie) => {
        const { id, title, poster_path, vote_average, overview } = movie
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `
        movieEl.addEventListener('click', () => showPopup(id, title))
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

async function showPopup(movieId, title) {
    const url = TRAILER_API.replace('MOVIE_ID', movieId)
    const res = await fetch(url)
    const data = await res.json()
    const trailer = data.results.find(video => video.type === 'Trailer')
    
    if (trailer) {
        const videoSrc = `https://www.youtube.com/embed/${trailer.key}`
        popupTitle.innerText = title
        popupVideo.innerHTML = `<iframe width="100%" height="400px" src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`
        popup.style.display = 'flex'
    } else {
        popupTitle.innerText = title
        popupVideo.innerHTML = `<p>No trailer available.</p>`
        popup.style.display = 'flex'
    }
}

closePopup.addEventListener('click', () => {
    popup.style.display = 'none'
    popupVideo.innerHTML = ''
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)
        search.value = ''
    } else {
        window.location.reload()
    }
})
