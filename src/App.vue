<script>
export default {
    //
    data() {
        return {
            audioLink: "https://files.catbox.moe/9lryje.ogg",
            audioBlob: false,
            duckClicked: false,
        }
    },

    methods: {
        async fetchAudio() {
            await fetch(this.audioLink)
            .then((response) => {
                const reader = response.body.getReader();
                    
                return new ReadableStream({
                    start(controller) {
                        return pump();
                        
                        function pump() {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                            
                                controller.enqueue(value);
                                
                                return pump();
                            });
                        }
                    },
                })

            })
            .then((stream) => new Response(stream))
            .then((response) => response.blob())
            .then((blob) => this.audioBlob = URL.createObjectURL(blob))
        },

        playAudio() {
            if (!this.duckClicked) {
                this.duckClicked = true;
                let audio = new Audio(this.audioBlob);
                audio.loop = true;
                audio.play();
            }
        },
    },

    async mounted() {
        await this.fetchAudio();
    },
}
</script>

<template lang="pug">
img(@click="playAudio()" :class="{ 'duck-rotate': duckClicked }" src="/img/duckie-transparent.gif")
</template>

<style lang="scss">
@keyframes duck-rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

* {
    user-select:none;
}

body {
    margin:0;
}

#app {
    width:100vw;
    height:100vh;

    background-image: url("/img/29.gif");
    background-repeat: repeat;
    background-color: black;

    display:flex;
    justify-content:center;
    align-items:center;
    
    color: #ffee56;
    font-family: arial;
}

img {
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
</style>