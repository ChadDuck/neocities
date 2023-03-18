<script>
import { Howl } from 'howler';
import range from 'lodash.range';

export default {
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
            sizeSelect: [0, '10px', '15px', '20px', '25px', '30px', '35px', '40px'],
            layerSelect: [0, 94, 95, 96, 97, 98, 101, 102], // center duck is z-index 99
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
            return Math.round(Math.random() * (max - min) + min);
        },

        genStarCSS(ele, init = false) {
            let winX = window.innerWidth;
            let winY = window.innerHeight;

            let style = {
                position: 'absolute',
                'z-index': this.layerSelect[Number(ele.getAttribute('data-speed'))],
                height: this.sizeSelect[Number(ele.getAttribute('data-speed'))],
            };

            if (init) {
                style.top = this.getRanNum(10, winY) + 'px';
                style.left = this.getRanNum(10, winX) + 'px';
            } else {
                let pos;
                let winPercent;
                let genChance;

                // Percentage chance for star spawn based on window size
                if (winX > winY) {
                    winPercent = Math.round(((winY / winX) * 100) * 0.5);
                    genChance = !!(this.getRanNum(0, 100) > winPercent);
                } else if (winY > winX) {
                    winPercent = Math.round(((winX / winY) * 100) * 0.5);
                    genChance = !!!(this.getRanNum(0, 100) > winPercent);
                } else {
                    genChance = !!this.getRanNum(0, 1);
                }
                
                if (genChance) {
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

        // This function is not needed since the rework made data-speed match pixel movement
        // so, right now, it's unnecessary complexity :/
        // Might rework
        genSpeedValues() {
            // will produce 2 useless values but it's okay
            range(0, this.sizeSelect.length).forEach((ele, index) => {
                this.speedSelect.push(ele);
            })
        },

        calcStarAmount() {
            return Math.round(window.innerWidth * 0.04);
        },

        genStar(init) {
            let ranStar = this.stars[this.getRanNum(0, this.stars.length - 1)];

            let star = new Image();
            star.src = '/img/' + ranStar;
            star.classList.add('visStars');

            // data speed controls the size and layer values, set in genStarCSS
            star.setAttribute('data-speed', this.getRanNum(1, this.sizeSelect.length - 1));

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
                    // This is what I mean by unnecessary
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

                setInterval(() => this.animateStars(), 16) // close to 60fps
            }
        },
    },

    mounted() {
        this.browserName = this.checkAgent(navigator.userAgent.toLowerCase());

        // old .75 speed: https://files.catbox.moe/9lryje.ogg
        // old .80 speed: https://files.catbox.moe/v3qnzq.ogg
        this.audioLink = this.browserName === 'Safari' ? "https://files.catbox.moe/6t9cgy.mp3" : "https://files.catbox.moe/39x8z1.ogg";
        
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
        transform: translate(0px, 0px);
    }
    to {
        transform: translate(-304px, 234px);
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
        background: url("/img/SPACE22.gif") repeat;
        animation: space-slide 4.5s linear infinite;
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