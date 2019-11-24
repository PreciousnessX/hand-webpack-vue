<template>
  <div class="wrapper">
      <h1>THREE</h1>
      <page2></page2>  
      <page2></page2>  
      <page2></page2>  
  </div>
</template>

<script>
import page2 from './page2'
export default {
  name: "page3",
  components:{
    page2:page2
  },
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  created(){
    console.log('----------------page3----------------')  
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
        color: #f076df;
        font-weight: 600;
    }
}
</style>