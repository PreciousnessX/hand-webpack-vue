<template>
    <div class="wrapper hello">
        <p class="title">
            webpack-Demo
            <span
                class="iconfont icon-fangxinfei"
                style="color:pink;font-size:24px;"
                id="toalert"
            ></span>
        </p>
        <div id="box">
            <img
                v-if="flag"
                src="./static/images/wm.jpg"
                alt="哆啦A梦"
                id="img"
            />
        </div>
        <div>加一行文字</div>
        <router-link class="page1" to="/page1">page1</router-link>|
        <router-link class="page2" to="/page2/data1/data2">page2</router-link>|
        <a class="page3" @click="toPage3">page3</a>|
        <a class="page4" @click="toPage4">page4</a>
        <router-view></router-view>
        <!-- <div class="bg-box"> </div> -->
    </div>
</template>

<script>
import { setInterval } from "timers";
export default {
    name: "app",
    components: {},
    props: {},
    data() {
        return {
            task: null,
            flag: false
        };
    },
    watch: {},
    computed: {},
    methods: {
        toPage3() {
            this.$router.push({
                name: "three",
                query: {
                    a: "data1",
                    b: "data2"
                }
            });
        },
        toPage4() {
            this.$router.push({
                name: "four",
                params: {
                    a: "data1",
                    b: "data2"
                }
            });
        },
        longTime() {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve("执行完了");
                }, 5000);
            });
        },
        test: async function() {
            console.log("等待longtime执行完");
            var v = await this.longTime();
            // 等待上面的执行完，才执行下面的操作
            console.log(v);
        }
    },
    created() {
        var that = this;
        that.test();
    },
    mounted() {
        console.log($("#img"));
        $("#toalert").click(function() {
            alert("jquery已经加载成功");
        });
    }
};
</script>
<style lang="scss" scoped>
@import url("./static/css/font.css");
.wrapper {
    color: #ff0000;
    text-align: center;
    .title {
        font-size: 30px;
    }
    .bg-box {
        width: 500px;
        height: 300px;
        margin: 0 auto;
        background: url("./static/images/wm.jpg");
    }
    .page1,
    .page2,
    .page3,
    .page4 {
        margin: 20px 10px;
        cursor: pointer;
    }
    .page1 {
        color: #5b99fd;
    }
    .page2 {
        color: #a8e04d;
    }
    .page3 {
        color: #f076df;
    }
    .page4 {
        color: #8370b8;
    }
}
</style>