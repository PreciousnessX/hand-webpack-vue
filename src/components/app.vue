<template>
  <div class="wrapper hello">
      <p class="title">webpack-Demo <span class="iconfont icon-fangxinfei" style="color:pink;font-size:24px;" id="toalert"></span></p>
      <div id="box">
        <img src="../static/images/wm.jpg" alt="哆啦A梦">
      </div>
      <div>加一行文字</div>
      <!-- <div class="bg-box"> </div> -->
  </div>
</template>

<script>
export default {
name:'app', 
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){
    $("#toalert").click(function(){
      alert("jquery已经加载成功")
    })
  }
}
</script>
<style lang="scss" scoped>
@import url("../static/css/font.css");
.wrapper{
    color:#ff0000;
    text-align: center;
    .title{
      font-size: 30px;
    }
    .bg-box{
      width: 500px;
      height:300px;
      margin: 0 auto;
      background: url("../static/images/wm.jpg")
}
}
</style>