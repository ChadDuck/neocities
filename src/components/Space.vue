<script>
import { getRanNum } from '../assets/extras.js';
import range from 'lodash.range';

export default {
    props: [
        'starAmount',
    ],

    data() {
        return {
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
                // speed is set for each star ele as the data-speed attr
                // speed: [],
                // size: [0, 0, '10px', '15px', '20px', '25px', '30px', '35px', '40px'],
                speed: range(1, 15),
                size: range(14, 48, 4),
                layer: range(1, 25), // center duck is z-index 99
                min: {
                    bottom: -150,
                    left: -150,
                },
                //
                // division by multiplication against window.innerWidth, used in calcStarAmount.
                // 100 means star amount is equal to your width size, e.g. 1920 stars for 1920x1080
                // becomes a lagfest after 0.3 - 0.5 (on 4k, runs a little better on lower res)
                // maximum amount is set by the range element in div.options
                // ranLength: false,
            },
            starInterval: false,
            fps: 16,
        }
    },

    methods: {
        genStarCSS(ele, onScreen) { // called by genStar for init
            let win = {
                x: window.innerWidth,
                y: window.innerHeight,
            }
            let style = {};
            let starPos = {};

            if (onScreen) {
                starPos.bottom = getRanNum(10, win.y);
                starPos.left = getRanNum(10, win.x);
            } else {
                let winPercent;
                let genChance;

                // Percentage chance for star spawn position based on window size
                // gens a *rounded* whole number percentage, 50 if screen is 1:1 and inc/dec based on ratio
                // once gen., casts a bool if getRanNum is greater than percentage; reversed if y > x.
                if (win.x > win.y) {
                    winPercent = Math.round(((win.y / win.x) * 100) * 0.5);
                    genChance = !!(getRanNum(0, 100) > winPercent);
                } else if (win.y > win.x) {
                    winPercent = Math.round(((win.x / win.y) * 100) * 0.5);
                    genChance = !!!(getRanNum(0, 100) > winPercent);
                } else {
                    genChance = !!getRanNum(0, 1);
                }


                if (genChance) {
                    // Spawn more stars on top edge width > height
                    starPos.bottom = Number(win.y + 25,  win.y + 100);
                    starPos.left = getRanNum(25, win.x + 100);
                } else {
                    // spawn more stars on right edge if height > width
                    starPos.bottom = getRanNum(25, win.y);
                    starPos.left = getRanNum(win.x + 25, win.x + 100);
                }
            }

            style.position = 'absolute';
            style['z-index'] = this.config.layer[Number(ele.getAttribute('data-speed'))];
            style.height = this.config.size[Number(ele.getAttribute('data-speed'))] + 'px';
            style.bottom = starPos.bottom + 'px';
            style.left = starPos.left + 'px';

            ele.setAttribute('data-bottom', starPos.bottom);
            ele.setAttribute('data-left', starPos.left);

            for (const prop in style) {
                ele.style[prop] = style[prop];
            }

            return ele;
        },

        genStar(onScreen = false) {
            let ranStar = this.stars[getRanNum(0, this.stars.length - 1)];

            let star = new Image();
            star.src = '/img/' + ranStar;
            star.classList.add('visStars');

            // data speed controls the size and layer values, set in genStarCSS
            star.setAttribute('data-speed', this.config.speed[getRanNum(0, 13)]);

            star = this.genStarCSS(star, onScreen);

            document.getElementById('stars').appendChild(star);
        },

        // only used for initial page load
        genStars(onScreen = false) {
            for (let i = 0; i < this.starAmount; i++) {
                this.genStar(onScreen);
            }
        },

        // will add each star one by one as user changes range bar
        // 
        changeStarAmount() {
            let visStars = document.querySelectorAll('.visStars');

            if (this.starAmount > visStars.length) {
                for (let i = 0; i < this.starAmount - visStars.length; i++) {
                    this.genStar(true);
                }
            } else {
                for (let i = 0; i < visStars.length - this.starAmount; i++) {
                    visStars[getRanNum(0, visStars.length - 1)].remove();
                }
            }
        },

        animateStars() {
            let visStars = document.querySelectorAll('.visStars');

            visStars.forEach((ele) => {
                let bottom = Number(ele.getAttribute('data-bottom'));
                let left = Number(ele.getAttribute('data-left'));

                if (left < this.config.min.left || bottom < this.config.min.bottom) { 
                    ele.remove();
                    this.genStar(false); // you can use '...arguments' here but keeping the same format for simplicity
                } else {
                    let newBottom = bottom - Number(ele.getAttribute('data-speed'));
                    let newLeft = left - Number(ele.getAttribute('data-speed'));

                    ele.setAttribute('data-bottom', newBottom);
                    ele.setAttribute('data-left', newLeft);

                    ele.style.bottom = newBottom + 'px';
                    ele.style.left = newLeft + 'px';
                }
            });
        },

        setAnimateLoop() {
            clearInterval(this.starInterval);
            this.starInterval = setInterval(() => this.animateStars(), 16);
        },
    },

    mounted() {
        // this.config.ranLength = this.config.layer.length; // no reason for picking layer vs size, maybe faster to parse because int values? ¯\ (ツ) /¯
        this.genStars(true);
        this.setAnimateLoop();
    },

    beforeUnmount() {
        clearInterval(this.starInterval);
    },

    watch: {
        starAmount() {
            this.changeStarAmount();
        }
    }
}
</script>

<template lang="pug">
div#stars
</template>

<style scoped lang="scss">
div#stars {
    position:absolute;
    top:0;
    left:0;
    
    margin:0;
    padding:0;

    width:100vw;
    height:100vh;
}
</style>