//Note - merge two object into one Object.assign(obj1, obj2)

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const PLAYER_STORAGE_KEY = 'Kriss_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,
    //parse from JSON data String type into Javascript types - if empty -> return {}
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}
    , setConfig: function (key, value) {
        this.config[key] = value
        //JSON is Strig type -> put obj into String and add into localStorage
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: "Victory",
            singer: "Two Steps From Hell",
            path: './assets/music/Victory-TwoStepsFromHell-3890867.mp3',
            image: "./assets/img/maxresdefault.jpg"
        },
        {
            name: "Bo Xi Bo",
            singer: "Hoang Thuy Linh",
            path: './assets/music/BoXiBo-HoangThuyLinh-7702270.mp3',
            image: "./assets/img/Hoang_Thuy_Linh_full_sidebar.jpg"
        },
        {
            name: "La Anh (Chinese version)",
            singer: "Mong Nhien",
            path: './assets/music/LaAnh-MongNhienMengRan-7839255.mp3',
            image: "./assets/img/maxresdefault (1).jpg"
        },
        {
            name: "Waiting For You",
            singer: "Mono",
            path: './assets/music/WaitingForYou-MONOOnionn-7733882.mp3',
            image: "./assets/img/tieu-su-ca-si-mono-17.jpg"
        }
    ],
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeated = this.config.isRepeated
        repeatBtn.classList.toggle('active', this.isRepeated)
        randomBtn.classList.toggle('active', this.isRandom)
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    start: function () {


        //loadConfig
        this.loadConfig()
        console.log(this.config)
        //defines all properties of object
        this.defineProperties()


        //Listen and handle all the events
        this.handleEvents();

        //Load song info
        this.loadCurrentSong()

        //rendering playlist of musics into HTML
        this.render()
    },
    //function loadConfig when beginning run

    //function handle event DOM
    handleEvents: function () {
        const _this = this;
        const cdWitdh = cd.offsetWidth;
        //Process CD rotating and stop animate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })

        //pause animate when display first
        cdThumbAnimate.pause();

        document.onscroll = function () {
            // Process zoom in - zoom out of cdImg
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWitdh - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0
            cd.style.opacity = newWidth / cdWitdh
        }

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function () {
            if (audio.duration) {
                const currentProgress = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = currentProgress;
            }
        }

        progress.onchange = function (e) {
            const currentProgress = (audio.duration / 100 * e.target.value)
            audio.currentTime = currentProgress
            audio.play()
        }

        //Process next button when user clicks
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
            }
            _this.render();
            audio.play()
            //add some delays when trasfers into next song
            _this.scrollToActiveSong()

        }

        //Process previous button when user clicks
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.previousSong();
            }
            _this.render()
            audio.play()
            //add some delays when trasfers into next song
            _this.scrollToActiveSong()

        }

        //Process turn on / off random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Process song when audio ended
        audio.onended = function () {
            if (_this.isRepeated) {
                audio.play()
            } else {
                nextBtn.click();
            }
        }

        //Process repeat song again
        repeatBtn.onclick = function () {
            _this.isRepeated = !_this.isRepeated;
            _this.setConfig('isRepeated', _this.isRepeated)
            repeatBtn.classList.toggle('active', _this.isRepeated)
        }

        //Listsen event on playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode && !e.target.closest('.option')) {
                    _this.currentIndex = songNode.getAttribute('data-index')
                    _this.loadCurrentSong()
                    audio.play()
                } else {
                    console.log('BBBA')
                }
            }
        }

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        })
    }
    ,
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    }
    ,
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
        <div class="thumb"
            style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>`})
        playlist.innerHTML = htmls.join('')

    }
}
app.start();
console.log(app.currentSong)
