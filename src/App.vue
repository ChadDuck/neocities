<script>
import { Howl } from 'howler';

export default {
    // old .75 speed: https://files.catbox.moe/9lryje.ogg
    data() {
        return {
            audioLink: false,
            audioBlob: false,
            audio: false,
            duckClicked: false,
            duckInfoClicked: false,
            browserName: false,
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

        playAudio() {
            if (!this.duckClicked) {
                this.duckClicked = true;
                this.audio.play();
            }
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
    },

    mounted() {
        this.browserName = this.checkAgent(navigator.userAgent.toLowerCase());
        this.audioLink = this.browserName === 'Safari' ? "https://files.catbox.moe/ozel9m.mp3" : "https://files.catbox.moe/v3qnzq.ogg";
        this.loadAudio();
    }
}
</script>

<template lang="pug">
div.duck-box
    img.bubble(v-if="!duckClicked" src="/img/clickme-animated.gif")
    img.duck(@click="playAudio()" :class="{ 'duck-rotate': duckClicked }" src="/img/duckie-transparent.gif")
div.listen(v-if="duckClicked")
    img.listen(src="/img/duck-listen.gif" @click="duckInfoClicked = !duckInfoClicked")
    Transition(name="link-slide")
        div.link-box(v-if="duckInfoClicked")
            a(target="_blank" rel="noopener noreferrer" href="https://github.com/ChadDuck/neocities") Github
            a(target="_blank" rel="noopener noreferrer" href="https://neocities.org/") Neocities
div.space(:class="{ 'space-slide': duckClicked }")
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