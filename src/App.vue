<script>
import { checkAgent } from './assets/extras.js';

import MainView from './components/Main.vue';
import SpaceView from './components/Space.vue';

export default {
    components: {
        MainView,
        SpaceView,
    },

    data() {
        return {
            bigBang: 0,
            rangeAmount: 10,
            browserName: false,
            duckClicked: false,
        }
    },

    methods: {
        onResize() {
            this.bigBang += 1;
        },

        // calculates based on the width of the window
        // divided to prevent user from crashing their pc, e.g. if set range is 100, it's width * 1. if set to 50, it's width * .5 or width / 2.
        // keep in mind, innerWidth is scaled by your OS's resolution scaling.  if it's set to 150%, your browser innerWidth is 1.5x smaller.
        // god forbid you have an 8k monitor lmfao
    },

    created() {
        this.browserName = checkAgent(navigator.userAgent.toLowerCase());
        window.addEventListener('resize', this.onResize);
    },
    
    watch: {
        rangeAmount(newVal, oldVal) {
            console.log(newVal)
        }
    }
}
</script>

<template lang="pug">
MainView(@duckClicked="duckClicked = true" @starAmount="(n) => rangeAmount = n" :browserName="browserName")
SpaceView(v-if="duckClicked" :key="bigBang" :rangeAmount="rangeAmount")
</template>

<style lang="scss">
* {
    user-select:none;
}
body {
    margin:0;
    padding:0;
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
</style>