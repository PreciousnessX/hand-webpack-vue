<template>
  <div class="wrapper">
    <h1>ONE</h1>
    <div class="custom-tree-container">
      <!-- <div class="block">
        <p>使用 render-content</p>
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent"
        ></el-tree>
      </div> -->
      <div class="block">
        <p>使用 scoped slot</p>
        <el-button type="text" size="mini"  @click="addContent">添加一个章节</el-button>
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" v-if="node.level==1||node.level==2" @click="() => addChild(node,data)">添加</el-button>
              <el-button type="text" size="mini" @click="() => modify(node, data)">修改</el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
let id = 1000;
export default {
  name: "page1",
  components: {},
  props: {},
  data() {
    return {
      data: []
    };
  },
  watch: {},
  computed: {},
  created() {
    this.createdZ()
  },
  mounted() {},
  methods: {
    createdZ(){
      this.$utils.addZ.post(res=>{
        if(res.data&&res.data.length>0){
          /**
           * res.data = [
           *  { dataId："3sdfhs2434dfk",
           *    label: "章",
           *    childern:[
           *             { dataId:"3432nbvbbnxbnwerbter",
           *               label:"节",
           *               children:[{ dataId:"3fsdfbvbbnxbnwerbter",label:"节"},...]
           *              },...]
           *   },...]
           *  */ 
          // 有dataId 说明数据库中已存在此条数据
          // 循环一下 res.data  为其添加id
          this.data = res.data;
        }else{
          this.data=[
            {
              id:id++,
              label:"zhang",
              children:[
                {id:id++,label:"jie",children:[]}
              ]
            }
          ]
        }
      })
    },
    addContent(){
      // 添加一个章节
      this.$prompt("请输入章名","提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value})=>{
        this.data.push({id:id++,label:value,children:[]})
      })
    },
    addChild(node,data){
      // 增加子节点
      var promptMsg = node.level == 2?"请输入节名":"请输入目名"
       this.$prompt(promptMsg,"提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value})=>{
       const newChild = { id: id++, label:value, children: [] };
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(newChild);
      })
      
    },
    //修改
    modify(node,data){
      console.log(node)
      const msgMap={
        "1":"请输入章名",
        "2":"请输入节名",
        "3":"请输入目名",
      }
      // 修改自己
       this.$prompt(msgMap[node.level],"提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value})=>{
       this.$set(data, "label", value);
      })
    },
    
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    // renderContent(h, { node, data, store }) {
    //   return (
    //       <span class="custom-tree-node">
    //         <span>{node.label}</span>
    //         <span>
    //           <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
    //           <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
    //         </span>
    //       </span>);
    // }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  h1 {
    font-size: 56px;
    color: #5b99fd;
    font-weight: 600;
  }
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>