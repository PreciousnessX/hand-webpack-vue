<template>
  <div class="wrapper">
      <h1>TWO</h1>
      <h1>{{num}}</h1>
      <button @click='add'>增加数字</button>
  </div>
</template>

<script>
export default {
  name: "page2",
  components:{},
  props:{},
  data(){
    var num = 0
    return {
       num:num
    }
  },
  watch:{},
  computed:{},
  created(){
    console.log('----------------page2----------------')  
    console.log("params",this.$route.params)
    console.log("query",this.$route.query)
  },
  mounted(){},
  methods:{
    add(){
      this.num++
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
     h1{
        font-size: 56px;
        color: #a8e04d;
        font-weight: 600;
    }
}
</style>