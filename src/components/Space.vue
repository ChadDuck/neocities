<script>
import { getRanNum, getRandomArbitrary } from '../assets/extras.js';
import range from 'lodash.range';

export default {
    props: [
        'rangeAmount',
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
                // speed: range(500, 5000),
                size: range(5, 50),
                layer: range(5, 50), // center duck is z-index 99
                //
                // division by multiplication against window.innerWidth, used in calcStarAmount.
                // 100 means star amount is equal to your width size, e.g. 1920 stars for 1920x1080
                // becomes a lagfest after 0.3 - 0.5 (on 4k, runs a little better on lower res)
                // maximum amount is set by the range element in div.options
                ranLength: false,
            },
            starInterval: false,
            fps: 16,
            starAmount: 0,
        }
    },

    methods: {
        calcStarAmount() {
            this.starAmount = Math.round(window.innerWidth * (this.rangeAmount * 0.01));
        },

        calcOffScreenVal(slope, initPos, offScreenVal = 100) {
            // Point Slope Form
            let intercept = {
                y: (slope * -initPos.x) + initPos.y,
                x: 0,
            }

            intercept.x -= Math.round(offScreenVal);
            intercept.y += Math.round(intercept.x * slope);

            return intercept;
        },

        genStarCSS(ele, onScreen) { // called by genStar for init
            let win = {
                x: window.innerWidth,
                y: window.innerHeight,
            }

            let starPos = {};

            let style = {};

            if (onScreen) {
                starPos.y = getRanNum(10, win.y);
                starPos.x = getRanNum(10, win.x);
            } else {
                let winPercent;
                let genChance;

                // Percentage chance for star spawn position based on window size
                // gens a *rounded* whole number percentage, 50 if screen is 1:1 and inc/dec based on ratio
                // once gen., casts a bool if getRanNum is greater than percentage; reversed if y > x.
                // if (win.x > win.y) {
                //     winPercent = Math.round(((win.y / win.x) * 100) * 0.5);
                //     genChance = !!(getRanNum(0, 100) > winPercent);
                // } else if (win.y > win.x) {
                    // winPercent = Math.round(((win.x / win.y) * 100) * 0.5);
                    // genChance = !!!(getRanNum(0, 100) > winPercent);
                // } else {
                //     genChance = !!getRanNum(0, 1);
                // }

                if (win.y > win.x) {
                    winPercent = Math.round(((win.x / win.y) * 100) * 0.5);
                    genChance = !!!(getRanNum(0, 100) > winPercent);
                } else {
                    genChance = !!getRanNum(0, 1);
                }
                


                if (genChance) {
                    // Spawn more stars on top edge width > height
                    starPos.y = getRanNum(win.y + 25,  win.y + 100);
                    starPos.x = getRanNum(50, win.x + 50);
                } else {
                    // spawn more stars on right edge if height > width
                    // init spawn of height 100 is to prevent stars spawning below visible area
                    starPos.y = getRanNum(50, win.y + 50);
                    starPos.x = getRanNum(win.x + 25, win.x + 100);
                }
            }
            let starSpeed;

            if (starPos.x < win.x * .3 || starPos.x > win.x * .75 && starPos.y < win.y * .3) {
                starSpeed = Number(ele.getAttribute('data-speed')) * getRandomArbitrary(1,2);
                style.height = this.config.size[getRanNum(5, 18)] + 'px';
            } else {
                starSpeed = Number(ele.getAttribute('data-speed'));
                style.height = this.config.size[getRanNum(16, 34)] + 'px';
            }

            // let starSpeed = starPos.x < 100 || starPos.y < 100 ? 1000 : Number(ele.getAttribute('data-speed'));
            // let starSpeed = Number(ele.getAttribute('data-speed'));

            style.position = 'absolute';
            style['z-index'] = this.config.layer[Math.round(starSpeed * .01)];
            // style.width = this.sizeRange[Math.round(starSpeed * .01)] + 'px';
            style.bottom = starPos.y + 'px';
            style.left = starPos.x + 'px';

            starPos.slope = this.calcOffScreenVal(.5, starPos, 500);

            let animationKeys = [
                { bottom: starPos.y + 'px', left: starPos.x + 'px' },
                { bottom: starPos.slope.y  + 'px', left: starPos.slope.x + 'px' },
            ];
            let animationConfig = {
                duration: starSpeed,
                iteration: 1,
            }

            ele.animate(animationKeys, animationConfig);

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
            star.setAttribute('data-speed', getRanNum(2000, 4499));
            star.setAttribute('data-star', getRanNum(0, this.starAmount - 1));

            star = this.genStarCSS(star, onScreen);

            document.getElementById('stars').appendChild(star);

            Promise.all(
                star.getAnimations().map((animation) => animation.finished)
            ).then(async () => { await this.reGenStar(star); });
        },

        // only used for initial page load
        genStars(onScreen = false) {
            for (let i = 0; i < this.starAmount; i++) {
                this.genStar(onScreen);
            }
        },

        async reGenStar(starEle) {
            let visStars = document.querySelectorAll('.visStars');

            if (this.starAmount > visStars.length) {
                starEle.remove();
                this.genStar();
            } else {
                starEle.remove();
            }
        },

        // will add each star one by one as user changes range bar
        // 
        changeStarAmount(onScreen = true) {
            let visStars = document.querySelectorAll('.visStars');

            if (this.starAmount > visStars.length) {
                for (let i = 0; i < this.starAmount - visStars.length; i++) {
                    this.genStar(onScreen);
                }
            } else {
                for (let i = 0; i < visStars.length - this.starAmount; i++) {
                    visStars[getRanNum(0, visStars.length - 1)].remove();
                }
            }
        },

        // animateStars() {
        //     let visStars = document.querySelectorAll('.visStars');

        //     visStars.forEach((ele) => {
        //         // old
        //         // let top = Number(ele.style.top.substring(0, ele.style.top.indexOf('px')));
        //         // let left = Number(ele.style.left.substring(0, ele.style.left.indexOf('px')));

        //         let top = Number(ele.getAttribute('data-top'));
        //         let left = Number(ele.getAttribute('data-left'));

        //         if (left < -100 || top > (window.innerHeight + 10)) { 
        //             ele.remove();
        //             this.genStar(false); // you can use '...arguments' here but keeping the same format for simplicity
        //         } else {
        //             let newTop = top + Number(ele.getAttribute('data-speed'));
        //             let newLeft = left - Number(ele.getAttribute('data-speed'));

        //             ele.setAttribute('data-top', newTop);
        //             ele.setAttribute('data-left', newLeft);

        //             ele.style.top = newTop + 'px';
        //             ele.style.left = newLeft + 'px';
        //         }
        //     });
        // },

        // setAnimateLoop() {
        //     clearInterval(this.starInterval);
        //     this.starInterval = setInterval(() => this.animateStars(), 16);
        // },
    },

    mounted() {
        this.calcStarAmount();
        this.config.ranLength = this.config.layer.length; // no reason for picking layer vs size, maybe faster to parse because int values? ¯\ (ツ) /¯

        this.genStars(true);
        // this.setAnimateLoop();
    },

    beforeUnmount() {
        // clearInterval(this.starInterval);
    },

    watch: {
        rangeAmount() {
            this.calcStarAmount();
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