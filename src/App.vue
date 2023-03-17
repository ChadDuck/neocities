<script>
export default {
    data() {
        return {
            audioLink: "https://files.catbox.moe/9lryje.ogg",
            audioBlob: false,
            duckClicked: false,
            duckInfoClicked: false,
        }
    },

    methods: {
        playAudio() {
            // Javascript client-side loading bypasses hotlinking rule
            if (!this.duckClicked) {
                this.duckClicked = true;
                let audio = new Audio(this.audioLink);
                audio.loop = true;
                audio.play();
            }
        },
    },
}
</script>

<template lang="pug">
img.duck(@click="playAudio()" :class="{ 'duck-rotate': duckClicked }" src="/img/duckie-transparent.gif")
div.listen(v-if="duckClicked")
    img.listen(src="/img/duck-listen.gif" @click="duckInfoClicked = !duckInfoClicked")
    Transition(name="link-slide")
        a(v-if="duckInfoClicked" target="_blank" rel="noopener noreferrer" href="https://github.com/ChadDuck/neocities") Github
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

    background-image: url("/img/29.gif");
    background-repeat: repeat;
    background-color: black;

    &.space-slide {
        animation: space-slide 2s linear infinite;
    }
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

    & > a {
        color:inherit;
        text-decoration:none;
        &:hover {
            color:#e2d34b;
        }
    }
}
</style>