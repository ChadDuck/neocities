<script>
// import { Howl } from 'howler';

export default {
    emits: ['duckClicked', 'starAmount'],
    props: [
        'browserName',
    ],

    data() {
        return {
            audioLink: false,
            audio: false,
            duckClicked: false,
            duckInfoClicked: false,
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
            // this.audio = new Howl({
            //     src: [this.audioLink],
            //     loop: true,
            // });
            ModPlayer.init({
                loop: true,
            })
            .then(() => {
                ModPlayer.loadModule('https://chadduck.net/polyester.mod');
            }).catch((err) => {
                console.log(err)
            });
        },

        // Init function which starts star gen
        // follow the chain from here
        duckClick() {
            if (!this.duckClicked) {
                document.title = 'space duck';

                this.duckClicked = true;
                this.$emit('duckClicked');

                ModPlayer.play();
            }
        },
    },

    mounted() {
        // old .75 speed: https://files.catbox.moe/9lryje.ogg
        // old .80 speed: https://files.catbox.moe/v3qnzq.ogg
        this.audioLink = this.browserName === 'Safari' ? "https://files.catbox.moe/6t9cgy.mp3" : "https://files.catbox.moe/39x8z1.ogg";
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
            //- v-model="starAmount"
            //- @input="$emit('starAmount', starAmount)"
            input(@input="$emit('starAmount', $event.target.value)" type='range' min="1" max="75" value="10")
        div.listen
            img(src="/img/duck-listen.gif" @click="duckInfoClicked = !duckInfoClicked")
            Transition(name="link-slide")
                div.link-box(v-if="duckInfoClicked")
                    a(target="_blank" rel="noopener noreferrer" href="https://github.com/ChadDuck/neocities") github
                    a(target="_blank" rel="noopener noreferrer" href="https://neocities.org/") neocities
div.space( :class="{ 'space-slide': duckClicked }")
</template>

<style scoped lang="scss">
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

div.space {
    z-index:-99;
    width:750vw;
    height:750vh;

    min-width:468px;
    min-height:608px;
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
        max-width:300px;
        min-width:100px;
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