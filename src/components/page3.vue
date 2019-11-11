<template>
  <div class="wrapper">
      <h1>THREE</h1>  
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