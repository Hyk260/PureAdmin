<!-- 拼图游戏 -->
<template>
  <div class="box">
    <div class="button">
      <el-button @click="shuffle" class="replay">重置</el-button>
      <el-button @click="autoPlay" class="autoplay">自动</el-button>
    </div>
    <transition-group name="cell" tag="div" class="container">
      <div
        @click.prevent="clickBlock(index)"
        v-for="(puzzle, index) in puzzles"
        :key="puzzle"
        :class="getPuzzleClass(puzzle)"
      >
        <img class="picture" v-if="puzzle !== 0" :src="picture(puzzle)" alt="" />
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { throttle, chunk, flatten } from "lodash-es";

function picture(i) {
  const num = {
    1: require("@/assets/Ubisoft/1.jpg"),
    2: require("@/assets/Ubisoft/2.jpg"),
    3: require("@/assets/Ubisoft/3.jpg"),
    4: require("@/assets/Ubisoft/4.jpg"),
    5: require("@/assets/Ubisoft/5.jpg"),
    6: require("@/assets/Ubisoft/6.jpg"),
    7: require("@/assets/Ubisoft/7.jpg"),
    8: require("@/assets/Ubisoft/8.jpg"),
  }[i];
  return num;
}
const puzzles = ref([1, 2, 3, 4, 5, 6, 7, 8, 0]);

const getPuzzleClass = (puzzle) => {
  return puzzle == "0" ? "cell cells" : "cell";
};
// 洗牌
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

shuffleArray(puzzles.value);

const throttleShuffle = throttle(() => {
  shuffleArray(puzzles.value);
}, 350);

const shuffle = () => {
  throttleShuffle();
};

const clickBlock = (index) => {
  let curIndex = puzzles.value[index];
  let leftIndex = puzzles.value[index - 1];
  let rightIndex = puzzles.value[index + 1];
  let topIndex = puzzles.value[index - 3];
  let bottomIndex = puzzles.value[index + 3];

  if (leftIndex == 0 && index % 3) {
    setbute(index - 1, curIndex, index);
  } else if (rightIndex == 0 && 2 !== index % 3) {
    setbute(index + 1, curIndex, index);
  } else if (topIndex == 0) {
    setbute(index - 3, curIndex, index);
  } else if (bottomIndex == 0) {
    setbute(index + 3, curIndex, index);
  }
  checkPass();
};

const setbute = (key, val, i) => {
  puzzles.value[key] = val;
  puzzles.value[i] = 0;
};

const checkPass = () => {
  if (puzzles.value[8] === 0) {
    const newPuzzles = puzzles.value.slice(0, 8);
    const isPass = newPuzzles.every((e, i) => e === i + 1);
    if (isPass) {
      console.log("通过");
    }
  }
};

const autoPlay = () => {
  let Setting = {
    originalNode: chunk(puzzles.value, 3),
    // => [[1, 3, 2],[5, 8, 0],[7, 6, 4]],
    resultNode: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ],
    delayTime: "500",
  };
  const allow = autoPuzzles(Setting).canReach(Setting.originalNode, Setting.resultNode);
  if (allow) {
    console.log("开始拼图");
    autoPuzzles(Setting).searchPath();
  } else {
    shuffle();
    setTimeout(() => {
      autoPlay();
    }, 1000);
  }
};
// 自动执行
const autoPuzzles = (Setting) => {
  let queueArr = []; //队列
  let hashObj = {}; //hash
  let NodeObj = {}; //记录节点
  let originalNode = Setting.originalNode; //原始节点
  let originalNodeStr = originalNode.toString().split(",").join("");
  let resultNode = Setting.resultNode; //结果节点
  let resultNodeStr = resultNode.toString().split(",").join("");
  let isFind = false;
  let delay = Setting.delayTime || 1000; //动画延迟

  return {
    // 是否可以进行自动拼图
    canReach(originalNode, resultNode) {
      originalNode = originalNode.toString().split(",");
      resultNode = resultNode.toString().split(",");
      this.readerDom(originalNode);
      if (this.odevity(originalNode) === this.odevity(resultNode)) {
        return true;
      } else {
        return false;
      }
    },
    // 求逆序奇偶性
    odevity(node) {
      var num = 0;
      node.splice(node.indexOf("0"), 1);
      node.forEach(function (item, index) {
        for (var i = 0; i < index; i++) {
          if (node[i] != 0) {
            if (node[i] > item) {
              num++;
            }
          }
        }
      });
      if (num % 2) {
        return 1;
      } else {
        return 0;
      }
    },
    // 寻找路径
    searchPath() {
      var _this = this;
      queueArr.push(originalNode);
      hashObj[originalNodeStr] = originalNode;
      while (!isFind) {
        if (!queueArr.length) {
          alert("没搜索到结果");
          return;
        }
        let currentNode = queueArr.shift(),
          currentNodeStr = currentNode.toString().split(",").join("");
        if (resultNodeStr === currentNodeStr) {
          let path = [];
          let pathLength = 0;
          let resultPath = [];
          for (let v = resultNodeStr; v != originalNodeStr; v = NodeObj[v]) {
            path.push(hashObj[v]);
          }
          path.push(hashObj[originalNodeStr]);
          pathLength = path.length;
          for (let i = 0; i < pathLength; i++) {
            resultPath.push(path.pop());
          }
          setTimeout(function () {
            _this.returnStep(resultPath);
          }, 500);
          isFind = true;
          return;
        }
        // return;
        let result = this.getChildNodes(currentNode);
        result.forEach(function (item, i) {
          let itemStr = item.toString().split(",").join("");
          if (!hashObj[itemStr]) {
            queueArr.push(item);
            hashObj[itemStr] = item;
            NodeObj[itemStr] = currentNodeStr;
          }
        });
      }
    },
    // 返回步骤信息
    returnStep(path) {
      var _this = this;
      path.forEach(function (item, index) {
        setTimeout(
          function (node) {
            _this.readerDom(node);
          }.bind(_this, item),
          index * delay
        );
      });
    },
    // 渲染dom
    readerDom(node) {
      let nodeArr = node.toString().split(",");
      puzzles.value = nodeArr;
      checkPass();
    },
    // 获取子节点
    getChildNodes(currentNode) {
      if (!Array.isArray(currentNode)) return;
      let target = {},
        childNodesArr = [],
        direction = [],
        rowNum = currentNode.length,
        colNum = currentNode[0].length;
      currentNode.forEach(function (item, i) {
        item.forEach(function (obj, k) {
          if (obj === 0 || obj === "0") {
            target = { x: k, y: i };
          }
        });
      });
      direction = this.getDirection(target, rowNum, colNum);
      return this.changePos(currentNode, target, direction);
    },
    // 获取方向
    getDirection(target, rowNum, colNum) {
      let direction = [];
      if (!target.x) {
        direction.push("right");
      } else if (target.x === colNum - 1) {
        direction.push("left");
      } else {
        direction = direction.concat(["left", "right"]);
      }

      if (!target.y) {
        direction.push("down");
      } else if (target.y === rowNum - 1) {
        direction.push("up");
      } else {
        direction = direction.concat(["down", "up"]);
      }
      return direction;
    },
    // 改变位置
    changePos(node, target, direction) {
      if (direction.length) {
        let childNodesArr = [];
        direction.forEach(function (item, index) {
          let temp;
          let _node = JSON.parse(JSON.stringify(node));
          switch (item) {
            case "left":
              temp = _node[target.y][target.x];
              _node[target.y][target.x] = _node[target.y][target.x - 1];
              _node[target.y][target.x - 1] = temp;
              break;
            case "right":
              temp = _node[target.y][target.x];
              _node[target.y][target.x] = _node[target.y][target.x + 1];
              _node[target.y][target.x + 1] = temp;
              break;
            case "down":
              temp = _node[target.y][target.x];
              _node[target.y][target.x] = _node[target.y + 1][target.x];
              _node[target.y + 1][target.x] = temp;
              break;
            case "up":
              temp = _node[target.y][target.x];
              _node[target.y][target.x] = _node[target.y - 1][target.x];
              _node[target.y - 1][target.x] = temp;
              break;
          }
          childNodesArr.push(_node);
        });
        return childNodesArr;
      }
    },
  };
};
</script>

<style lang="scss" scoped>
.picture {
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
  user-select: none;
  cursor: pointer;
}
.container {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  height: 300px;
  margin-top: 10px;
  background: #896530;
  position: relative;
  overflow: hidden;
}
.cell {
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100px;
  height: 100px;
  box-shadow: 0px 0px 3px #333333;
  background-color: #26a6e3bf;
}
.cells {
  background-color: #fff;
  box-shadow: 0px 0px 0px #333333;
  z-index: -999;
}
.cell-move {
  transition: transform 0.4s;
}
</style>
