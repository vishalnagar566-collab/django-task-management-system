// ==========================================
// HTML ELEMENTS
// ==========================================

const movieContainer =
    document.getElementById("movieContainer");

const favoriteContainer =
    document.getElementById("favoriteContainer");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const suggestions =
    document.getElementById("suggestions");

const movieModal =
    document.getElementById("movieModal");

const closeModal =
    document.getElementById("closeModal");

const modalBody =
    document.getElementById("modalBody");

const loading =
    document.getElementById("loading");

const favoriteCount =
    document.getElementById("favoriteCount");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const yearFilter =
    document.getElementById("yearFilter");

const ratingFilter =
    document.getElementById("ratingFilter");

const sortFilter =
    document.getElementById("sortFilter");

const moviesPerPage = 2;

// ==========================================
// FILTER STATE
// ==========================================

let selectedGenre = "All";


// ==========================================
// MOVIE DATA
// ==========================================

const movies = [

    {
        id: 1,
        title: "Inception",
        year: 2010,
        rating: 8.8,
        genre: "Sci-Fi",

        poster:
            "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",

        overview:
            "A skilled thief enters people's dreams to steal secrets."
    },

    {
        id: 2,
        title: "Interstellar",
        year: 2014,
        rating: 8.7,
        genre: "Sci-Fi",

        poster:
            "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",

        overview:
            "A team of explorers travels through space to find a new home for humanity."
    },

    {
        id: 3,
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        genre: "Action",

        poster:
            "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",

        overview:
            "Batman faces a dangerous criminal who threatens Gotham City."
    },

    {
        id: 4,
        title: "Avengers: Endgame",
        year: 2019,
        rating: 8.4,
        genre: "Action",

        poster:
            "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",

        overview:
            "The Avengers attempt to undo the devastating events of the past."
    }

];


// ==========================================
// FAVORITES
// ==========================================

let favorites =
    JSON.parse(
        localStorage.getItem("movieFavorites")
    ) || [];


// ==========================================
// CHECK FAVORITE
// ==========================================

function isFavorite(movieId) {

    return favorites.some(
        movie => movie.id === movieId
    );

}


// ==========================================
// SAVE FAVORITES
// ==========================================

function saveFavorites() {

    localStorage.setItem(
        "movieFavorites",
        JSON.stringify(favorites)
    );

}


// ==========================================
// UPDATE FAVORITE COUNT
// ==========================================

function updateFavoriteCount() {

    favoriteCount.textContent =
        `(${favorites.length})`;

}


// ==========================================
// DISPLAY MOVIES
// ==========================================

function displayMovies(movieList) {

    loading.style.display = "block";

    movieContainer.innerHTML = "";


    if (movieList.length === 0) {

        loading.style.display = "none";

        movieContainer.innerHTML = `

            <p class="no-results">
                😔 No movies found
            </p>

        `;

        return;
    }


    loading.style.display = "none";


    movieList.forEach(movie => {

        const movieCard =
            document.createElement("div");


        movieCard.className =
            "movie-card";


        movieCard.innerHTML = `

            <div class="movie-poster">

                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                >

            </div>


            <div class="movie-info">

                <h3>
                    ${movie.title}
                </h3>


                <p>
                    ${movie.genre} • ${movie.year}
                </p>


                <div class="rating">
                    ⭐ ${movie.rating}
                </div>


                <div class="movie-buttons">

                    <button
                        class="details-btn"
                    >
                        View Details
                    </button>


                    <button
                        class="favorite-btn"
                    >
                        ${
                            isFavorite(movie.id)
                                ? "💔 Remove"
                                : "❤️ Favorite"
                        }
                    </button>

                </div>

            </div>

        `;


        // Details button

        const detailsBtn =
            movieCard.querySelector(
                ".details-btn"
            );


        detailsBtn.addEventListener(
            "click",
            () => {

                openMovieModal(movie);

            }
        );


        // Favorite button

        const favoriteBtn =
            movieCard.querySelector(
                ".favorite-btn"
            );


        favoriteBtn.addEventListener(
            "click",
            () => {

                toggleFavorite(movie.id);

            }
        );


        movieContainer.appendChild(
            movieCard
        );

    });

}


// ==========================================
// TOGGLE FAVORITE
// ==========================================

function toggleFavorite(movieId) {

    const movie =
        movies.find(
            movie => movie.id === movieId
        );


    if (!movie) {

        return;

    }


    if (isFavorite(movieId)) {

        favorites =
            favorites.filter(
                movie => movie.id !== movieId
            );

    } else {

        favorites.push(movie);

    }


    saveFavorites();

    updateFavoriteCount();

    displayMovies(
        getFilteredMovies()
    );

    displayFavorites();

}


// ==========================================
// DISPLAY FAVORITES
// ==========================================

function displayFavorites() {

    favoriteContainer.innerHTML = "";

    updateFavoriteCount();


    if (favorites.length === 0) {

        favoriteContainer.innerHTML = `

            <p class="no-favorites">
                ❤️ No favorite movies yet
            </p>

        `;

        return;
    }


    favorites.forEach(movie => {

        const movieCard =
            document.createElement("div");


        movieCard.className =
            "movie-card";


        movieCard.innerHTML = `

            <div class="movie-poster">

                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                >

            </div>


            <div class="movie-info">

                <h3>
                    ${movie.title}
                </h3>


                <p>
                    ${movie.genre} • ${movie.year}
                </p>


                <div class="rating">
                    ⭐ ${movie.rating}
                </div>


                <div class="movie-buttons">

                    <button
                        class="details-btn"
                    >
                        View Details
                    </button>


                    <button
                        class="favorite-btn"
                    >
                        💔 Remove
                    </button>

                </div>

            </div>

        `;


        const detailsBtn =
            movieCard.querySelector(
                ".details-btn"
            );


        detailsBtn.addEventListener(
            "click",
            () => {

                openMovieModal(movie);

            }
        );


        const favoriteBtn =
            movieCard.querySelector(
                ".favorite-btn"
            );


        favoriteBtn.addEventListener(
            "click",
            () => {

                toggleFavorite(movie.id);

            }
        );


        favoriteContainer.appendChild(
            movieCard
        );

    });

}


// ==========================================
// MOVIE MODAL
// ==========================================

function openMovieModal(movie) {

    modalBody.innerHTML = `

        <img
            class="modal-poster"
            src="${movie.poster}"
            alt="${movie.title}"
        >


        <div class="modal-info">

            <h2>
                ${movie.title}
            </h2>


            <p>
                📅 Release Year:
                ${movie.year}
            </p>


            <p>
                🎭 Genre:
                ${movie.genre}
            </p>


            <div class="modal-rating">
                ⭐ ${movie.rating}
            </div>


            <p>
                ${movie.overview}
            </p>


            <button
                class="modal-favorite"
                id="modalFavoriteBtn"
            >
                ${
                    isFavorite(movie.id)
                        ? "💔 Remove from Favorites"
                        : "❤️ Add to Favorites"
                }
            </button>

        </div>

    `;


    movieModal.classList.add("show");


    const modalFavoriteBtn =
        document.getElementById(
            "modalFavoriteBtn"
        );


    modalFavoriteBtn.addEventListener(
        "click",
        () => {

            toggleFavorite(movie.id);

            openMovieModal(movie);

        }
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener(
    "click",
    () => {

        movieModal.classList.remove(
            "show"
        );

    }
);


// ==========================================
// CLOSE MODAL OUTSIDE
// ==========================================

movieModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === movieModal
        ) {

            movieModal.classList.remove(
                "show"
            );

        }

    }
);


// ==========================================
// GET FILTERED + SORTED MOVIES
// ==========================================

function getFilteredMovies() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedYear =
        yearFilter.value;


    const selectedRating =
        ratingFilter.value;


    const selectedSort =
        sortFilter.value;


    // ======================================
    // FILTER
    // ======================================

    let filteredMovies =
        movies.filter(movie => {


            const matchesSearch =
                movie.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesGenre =
                selectedGenre === "All" ||
                movie.genre === selectedGenre;


            const matchesYear =
                selectedYear === "All" ||
                movie.year.toString() === selectedYear;


            const matchesRating =
                selectedRating === "All" ||
                movie.rating >= Number(
                    selectedRating
                );


            return (
                matchesSearch &&
                matchesGenre &&
                matchesYear &&
                matchesRating
            );

        });


    // ======================================
    // SORT
    // ======================================

    switch (selectedSort) {

        case "ratingHigh":

            filteredMovies.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "ratingLow":

            filteredMovies.sort(
                (a, b) =>
                    a.rating - b.rating
            );

            break;


        case "yearNew":

            filteredMovies.sort(
                (a, b) =>
                    b.year - a.year
            );

            break;


        case "yearOld":

            filteredMovies.sort(
                (a, b) =>
                    a.year - b.year
            );

            break;


        case "titleAZ":

            filteredMovies.sort(
                (a, b) =>
                    a.title.localeCompare(
                        b.title
                    )
            );

            break;


        case "titleZA":

            filteredMovies.sort(
                (a, b) =>
                    b.title.localeCompare(
                        a.title
                    )
            );

            break;


        default:

            break;

    }


    return filteredMovies;

}


// ==========================================
// SEARCH
// ==========================================

function searchMovies() {

    displayMovies(
        getFilteredMovies()
    );


    suggestions.innerHTML = "";

    suggestions.style.display =
        "none";

}


searchBtn.addEventListener(
    "click",
    searchMovies
);


// ==========================================
// ENTER KEY SEARCH
// ==========================================

searchInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            searchMovies();

        }

    }
);


// ==========================================
// SEARCH AUTOCOMPLETE
// ==========================================

searchInput.addEventListener(
    "input",
    () => {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        suggestions.innerHTML = "";


        if (searchText === "") {

            suggestions.style.display =
                "none";

            return;

        }


        const matchingMovies =
            movies.filter(movie =>
                movie.title
                    .toLowerCase()
                    .includes(searchText)
            );


        if (matchingMovies.length === 0) {

            suggestions.style.display =
                "none";

            return;

        }


        matchingMovies.forEach(movie => {

            const suggestion =
                document.createElement("div");


            suggestion.className =
                "suggestion-item";


            suggestion.innerHTML = `

                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                >

                <div>

                    <strong>
                        ${movie.title}
                    </strong>

                    <span>
                        ${movie.year}
                        •
                        ⭐ ${movie.rating}
                    </span>

                </div>

            `;


            suggestion.addEventListener(
                "click",
                () => {

                    searchInput.value =
                        movie.title;


                    suggestions.innerHTML =
                        "";


                    suggestions.style.display =
                        "none";


                    displayMovies(
                        getFilteredMovies()
                    );

                }
            );


            suggestions.appendChild(
                suggestion
            );

        });


        suggestions.style.display =
            "block";

    }
);


// ==========================================
// GENRE FILTER
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            selectedGenre =
                button.dataset.genre;


            displayMovies(
                getFilteredMovies()
            );

        }
    );

});


// ==========================================
// YEAR FILTER
// ==========================================

yearFilter.addEventListener(
    "change",
    () => {

        displayMovies(
            getFilteredMovies()
        );

    }
);


// ==========================================
// RATING FILTER
// ==========================================

ratingFilter.addEventListener(
    "change",
    () => {

        displayMovies(
            getFilteredMovies()
        );

    }
);


// ==========================================
// SORT FILTER
// ==========================================

sortFilter.addEventListener(
    "change",
    () => {

        displayMovies(
            getFilteredMovies()
        );

    }
);


// ==========================================
// HIDE SUGGESTIONS WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener(
    "click",
    (event) => {

        if (
            !event.target.closest(".search-box")
        ) {

            suggestions.innerHTML = "";

            suggestions.style.display =
                "none";

        }

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

displayMovies(movies);

displayFavorites();

updateFavoriteCount();