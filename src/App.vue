<script>
import { Howl } from 'howler';
import range from 'lodash.range';

import { checkAgent, getRanNum } from './assets/extras.js';

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
            config: {
                speed: [],
                size: [0, '10px', '15px', '20px', '25px', '30px', '35px', '40px'],
                layer: [0, 94, 95, 96, 97, 98, 101, 102], // center duck is z-index 99

                // division by multiplication against window.innerWidth, used in calcStarAmount.
                // 1 means star amount is equal to your width size, e.g. 1920 stars for 1920x1080
                // becomes a lagfest after 0.3 - 0.5 (on 4k, runs a little better on lower res)
                amount: 5, 
            },
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

        genStarCSS(ele, init = false) {
            let winX = window.innerWidth;
            let winY = window.innerHeight;

            let style = {
                position: 'absolute',
                'z-index': this.config.layer[Number(ele.getAttribute('data-speed'))],
                height: this.config.size[Number(ele.getAttribute('data-speed'))],
            };

            if (init) {
                style.top = getRanNum(10, winY) + 'px';
                style.left = getRanNum(10, winX) + 'px';
            } else {
                let pos;
                let winPercent;
                let genChance;

                // Percentage chance for star spawn based on window size
                if (winX > winY) {
                    winPercent = Math.round(((winY / winX) * 100) * 0.5);
                    genChance = !!(getRanNum(0, 100) > winPercent);
                } else if (winY > winX) {
                    winPercent = Math.round(((winX / winY) * 100) * 0.5);
                    genChance = !!!(getRanNum(0, 100) > winPercent);
                } else {
                    genChance = !!getRanNum(0, 1);
                }
                
                if (genChance) {
                    pos = {
                        top: '-' + getRanNum(25, 100) + 'px',
                        left: getRanNum(25, window.innerWidth + 100) + 'px',
                    }
                } else {
                    pos = {
                        top: getRanNum(0, window.innerHeight - 100) + 'px',
                        left: getRanNum(window.innerWidth + 25, window.innerWidth + 100) + 'px',
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
            range(0, this.config.size.length).forEach((ele, index) => {
                this.config.speed.push(ele);
            })
        },

        calcStarAmount() {
            return Math.round(window.innerWidth * (this.config.amount * 0.01));
        },

        changeStarAmount() {
            console.log(this.config.amount)
            let visStars = document.querySelectorAll('.visStars');
            let newAmount = this.calcStarAmount();
            if (newAmount > visStars.length) {
                for (let i = 0; i < newAmount - visStars.length; i++) {
                    this.genStar(true);
                }
            } else {
                for (let i = 0; i < visStars.length - newAmount; i++) {
                    visStars[getRanNum(0, visStars.length - 1)].remove();
                }
            }
            console.log(this.config.amount)
        },

        genStar(init) {
            let ranStar = this.stars[getRanNum(0, this.stars.length - 1)];

            let star = new Image();
            star.src = '/img/' + ranStar;
            star.classList.add('visStars');

            // data speed controls the size and layer values, set in genStarCSS
            star.setAttribute('data-speed', getRanNum(1, this.config.size.length - 1));

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
                    ele.style.top = (top + this.config.speed[ele.getAttribute('data-speed')]) + 'px';
                    ele.style.left = (left - this.config.speed[ele.getAttribute('data-speed')]) + 'px';
                }
            });
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

        test(e) {
            console.log(e);
        }
    },

    mounted() {
        this.browserName = checkAgent(navigator.userAgent.toLowerCase());

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

template(v-if='duckClicked')
    div.menu
        div.options
            input(@input="changeStarAmount()" type='range' v-model="config.amount" min="1" max="100" orient="vertical")
        div.listen
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
        animation: space-slide 5s linear infinite;
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

div.menu {
    position:absolute;
    bottom:0;
    left:0;
    margin:5px;

    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start;
    gap:5px;

    width:fit-content;

    z-index:111;
}

div.options {
    position:relative;
    height:150px;
    width:50px;
    input {
        position:absolute;
        transform: translate(-40px, 65px) rotate(-90deg); // I don't even know man, i'm gonna change this when I come back to this
    }
}

div.listen {
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    gap:5px;

    width:fit-content;

    & > img {
        width:5vw;
        max-width:100px;
        height:auto;
        cursor:help;
    }

    a {
        color:inherit;
        text-decoration:none;
        @media screen and (max-width: 768px) {
            font-size:12px;
        }
        &:hover {
            color:#e2d34b;
        }
    }

    div.link-box {
        display:flex;
        flex-direction:column;
        justify-content:space-around;
        align-items:center;
        gap:10px;
    }
}
</style>