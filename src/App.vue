<script>
import { Howl } from 'howler';
import range from 'lodash.range';

export default {
    // old .75 speed: https://files.catbox.moe/9lryje.ogg
    data() {
        return {
            audioLink: false,
            audio: false,
            duckClicked: false,
            duckInfoClicked: false,
            browserName: false,
            stars: [
                'starwow.gif',
                'star.gif',
                'star1.gif',
                'star2.gif',
                'star_blue.gif',
                'star3ytu.gif',
                'anistar.gif',
                'caman_star.gif',
                'Star01.gif',
            ],
            speedSelect: [],
            sizeSelect: [0, 0, '15px', '25px', '30px', '35px'],
            layerSelect: [0, 0, 97, 98, 100, 101],
            windowResize: false,
        }
    },

    methods: {
        loadAudio() {
            // Javascript client-side loading bypasses hotlinking rule
            // Howler for seamless playback so I don't pull my hair out dealing with the js audio api
            //
            // old
            // this.audio = new Audio(this.audioLink);
            // this.audio.loop = true;
            //
            this.audio = new Howl({
                src: [this.audioLink],
                loop: true,
            });
        },

        getRanNum(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        },

        genStarCSS(ele, init = false) {
            let style = {
                position: 'absolute',
                'z-index': this.layerSelect[Number(ele.getAttribute('data-speed'))],
                height: this.sizeSelect[Number(ele.getAttribute('data-speed'))],
            };

            if (init) {
                style.top = this.getRanNum(10, window.innerHeight) + 'px';
                style.left = this.getRanNum(10, window.innerWidth) + 'px';
            } else {
                let pos;

                // Check if width smaller than height and flip behavior
                let genMethod;
                if (window.innerHeight > (window.innerWidth + 100)) {
                    genMethod = !!!this.getRanNum(0, 3)
                } else if (range[window.innerWidth - 100, window.innerWidth + 100].indexOf(window.innerHeight) > -1) { // if somewhat 1:1
                    genMethod = !!this.getRanNum(0, 2);
                } else { // window.innerWidth > window.innerHeight
                    genMethod = !!this.getRanNum(0, 3);
                }
                
                if (genMethod) {
                    pos = {
                        top: '-' + this.getRanNum(25, 100) + 'px',
                        left: this.getRanNum(25, window.innerWidth + 100) + 'px',
                    }
                } else {
                    pos = {
                        top: this.getRanNum(0, window.innerHeight - 100) + 'px',
                        left: this.getRanNum(window.innerWidth + 25, window.innerWidth + 100) + 'px',
                    }
                }

                style.top = pos.top;
                style.left = pos.left;
            }

            for (const prop in style) {
                ele.style[prop] = style[prop];
            }

            return ele;
        },

        genSpeedValues() {
            // will produce 2 useless values but it's okay
            range(0, 9).forEach((ele, index) => {
                this.speedSelect.push(ele);
            })
        },

        calcStarAmount() {
            switch(true) {
                case window.innerWidth > 768: return 100;
                case window.innerWidth > 1000: return 150;
                case window.innerWidth > 2000: return 200;
                case window.innerWidth > 3000: return 250;
                default: return 50;
            }
        },

        genStar(init) {
            let ranStar = this.stars[this.getRanNum(0, this.stars.length)];

            let star = new Image();
            star.src = '/img/' + ranStar;
            star.classList.add('visStars');

            // data speed controls the size and index values, set in genStarCSS
            star.setAttribute('data-speed', this.getRanNum(2, 6));
            star = this.genStarCSS(star, init);

            document.body.appendChild(star);
        },

        placeStars(loopCount) {
            for (let i = 0; i < loopCount; i++) {
                this.genStar(true);
            }
        },

        async animateStars() {
            let visStars = document.querySelectorAll('.visStars');

            visStars.forEach((ele, index) => {
                let top = Number(ele.style.top.substring(0, ele.style.top.indexOf('px')));
                let left = Number(ele.style.left.substring(0, ele.style.left.indexOf('px')));

                if (left < -100 || top > (window.innerHeight + 10)) { 
                    ele.remove();
                    this.genStar(false);
                } else {
                    ele.style.top = (top + this.speedSelect[ele.getAttribute('data-speed')]) + 'px';
                    ele.style.left = (left - this.speedSelect[ele.getAttribute('data-speed')]) + 'px';
                }
            });
        },

        checkAgent(userAgent) {
            switch (true) {
                case userAgent.indexOf("edge") > -1: return "EdgeOG";

                case userAgent.indexOf("edg/") > -1: return "Edge";

                case userAgent.indexOf("opr") > -1 && !!window.opr: return "Opera";

                case userAgent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";

                case userAgent.indexOf("trident") > -1: return "IE";

                case userAgent.indexOf("firefox") > -1: return "Firefox";

                case userAgent.indexOf("safari") > -1: return "Safari";

                default: return false;
            }
        },

        onResize() {
            let visStars = document.querySelectorAll('.visStars');

            if (visStars.length === 0) return;

            visStars.forEach((ele) => {
                ele.remove();
            })

            this.placeStars(this.calcStarAmount());
        },

        async duckClick() {
            if (!this.duckClicked) {
                document.title = 'space duck';
                this.placeStars(this.calcStarAmount());
                this.duckClicked = true;
                this.audio.play();
                this.genSpeedValues();

                setInterval(() => this.animateStars(), 15)
            }
        },
    },

    mounted() {
        this.browserName = this.checkAgent(navigator.userAgent.toLowerCase());
        this.audioLink = this.browserName === 'Safari' ? "https://files.catbox.moe/ozel9m.mp3" : "https://files.catbox.moe/v3qnzq.ogg";
        window.addEventListener("resize", this.onResize);
        this.loadAudio();
    }
}
</script>

<template lang="pug">
div.duck-box
    img.bubble(v-if="!duckClicked" src="/img/clickme-animated.gif")
    img.duck(@click="duckClick()" :class="{ 'duck-rotate': duckClicked }" src="/img/duckie-transparent.gif")
div.listen(v-if="duckClicked")
    img(src="/img/duck-listen.gif" @click="duckInfoClicked = !duckInfoClicked")
    Transition(name="link-slide")
        div.link-box(v-if="duckInfoClicked")
            a(target="_blank" rel="noopener noreferrer" href="https://github.com/ChadDuck/neocities") github
            a(target="_blank" rel="noopener noreferrer" href="https://neocities.org/") neocities
div.space( :class="{ 'space-slide': duckClicked }")
</template>

<style lang="scss">
@keyframes space-slide {
    from {
        transform: translate(0, 0);
    }
    to {
        transform: translate(-165px, 190px);
    }
}
@keyframes duck-rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.link-slide-enter-from, .link-slide-leave-to {
    transform: translateX(-100px);
    opacity: 0
}
.link-slide-enter-active, .link-slide-leave-active {
    transition: all .2s ease-in-out;
}

* {
    user-select:none;
}

body {
    margin:0;
    overflow:hidden;
}

#app {
    width:100vw;
    height:100vh;

    display:flex;
    justify-content:center;
    align-items:center;
    
    color: #ffee56;
    font-family: arial;
}

div.space {
    z-index:-99;
    width:1000vw;
    height:1000vh;
    position:absolute;

    background-color: black;

    &.space-slide {
        background-image: url("/img/29.gif");
        background-repeat: repeat;
        animation: space-slide 2s linear infinite;
    }
}

div.duck-box {
    width:fit-content;
    height:fit-content;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;

    position:relative;

    img.bubble {
        position:absolute;
        top:-50px;
        width:auto;
        height:50px;
    }

    img.duck {
        width:50px;
        height:50px;
        cursor: pointer;
        transition: width .2s, height .2s;
        z-index:99;

        &:hover {
            width:55px;
            height:55px;
        }

        &.duck-rotate {
            animation: duck-rotate 10s linear infinite;
        }
    }
}

div.listen {
    position:absolute;
    bottom:0;
    left:0;
    margin:5px;

    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    gap:5px;

    width:fit-content;

    & > img {
        width:100px;
        height:auto;
        cursor:help;

        z-index:111;
    }

    a {
        color:inherit;
        text-decoration:none;
        &:hover {
            color:#e2d34b;
        }
    }

    div.link-box {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        gap:10px;
    }
}
</style>