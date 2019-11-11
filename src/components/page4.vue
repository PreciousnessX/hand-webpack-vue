<template>
  <div class="wrapper">
      <h1>FOUR</h1>  
  </div>
</template>

<script>
export default {
  name: "page3",
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  created(){
    console.log('----------------page4----------------')  
    console.log("params",this.$route.params)
    console.log("query",this.$route.query)
  },
  mounted(){},
  methods:{}
}
</script>
<style lang="scss" scoped>
.wrapper{
    h1{
        font-size: 56px;
        color: #8370b8;
        font-weight: 600;
    }
}
</style>