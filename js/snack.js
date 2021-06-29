// 贪吃蛇游戏
// 工具
(() => {
  var tools = {
    getColor: () => "#" + Math.random().toString(16).slice(2, 5),
    getRandom: (i) => (Math.random() * i) | 0,
  };
  window.tools = tools;
})();

// 基础方块的构建
(() => {
  class Base {
    constructor(baseWidth) {
      this.baseWidth = baseWidth || 20;
      let div = document.createElement("div");
      div.classList.add("base");
      div.style.width = this.baseWidth + "px";
      div.style.height = this.baseWidth + "px";
      this.div = div;
    }

    get content() {
      return this.div;
    }

    initPosition() {
      this.div.style.left = this.left * this.baseWidth + "px";
      this.div.style.top = this.top * this.baseWidth + "px";
    }

    judge(base) {
      if (this.left == base.left && this.top == base.top) {
        return true;
      } else {
        return false;
      }
    }

    remove() {
      this.content.remove();
    }
  }
  window.Base = Base;
})();

// 蛇对象的构建
(() => {
  class Snake {
    constructor(opation) {
      opation = opation || {};
      this.opation = opation.baseWidth;
      this.length = opation.length || 5;
      this.parent = opation.parent;
      this.headColor = tools.getColor();
      this.bodyColor = tools.getColor();
      this.x = opation.x;
      this.y = opation.y;
      this.diretion = "right";
      this._init();
    }

    // 初始化
    _init() {
      if (!this.parent || this.length < 2) {
        throw new Error("构建失败");
      }
      this.head = this._createHead();
      this._setHead();
      this.body = this._createBody();
      this._setBody();
      this._initPosition();
      this.parent.append(this.head.content);
      this.body.forEach((it) => {
        this.parent.append(it.content);
      });
    }

    // 创建头部
    _createHead() {
      return new Base(this.opation);
    }

    // 设置头部
    _setHead() {
      this.head.content.style.backgroundColor = this.headColor;
      this.head.content.classList.add("head");
    }

    // 创建身体
    _createBody() {
      let body = [];
      for (let i = 0; i < this.length - 1; i++) {
        let temp = new Base(this.opation);
        body.push(temp);
      }
      return body;
    }

    // 设置身体
    _setBody() {
      this.body.forEach((it) => {
        it.div.style.backgroundColor = this.bodyColor;
      });
    }

    // 初始化位置
    _initPosition() {
      // 初始化top
      // 初始化left
      let length = this.length - 1;
      this.head.top = 0;
      this.head.left = length;
      this.head.initPosition();
      this.body.forEach((it, index) => {
        it.top = 0;
        it.left = length - index - 1;
        it.initPosition();
      });
    }

    _initHead() {
      switch (this.diretion) {
        case "right":
          this.head.content.style.transform = "rotate(0deg)";
          break;
        case "left":
          this.head.content.style.transform = "rotatey(180deg)";
          break;
        case "top":
          this.head.content.style.transform = "rotate(-90deg)";
          break;
        case "down":
          this.head.content.style.transform = "rotate(90deg)";
          break;
      }
    }

    // 方向
    _director() {
      this._initHead();
      switch (this.diretion) {
        case "right":
          this.head.left++;
          this.head.initPosition();
          break;
        case "left":
          this.head.left--;
          this.head.initPosition();
          break;
        case "top":
          this.head.top--;
          this.head.initPosition();
          break;
        case "down":
          this.head.top++;
          this.head.initPosition();
          break;
      }
    }

    // 吃下一个
    _eat(food) {
      this.head.content.classList.remove("eat");
      this.head.content.classList.remove("head");
      this.head.content.style.transform = "";
      let temp = this.head;
      this.head = food;
      this.head.content.classList.add("head");
      this.head.content.classList.add("eat");
      this._initHead();
      this.bodyColor = this.headColor;
      this.headColor = this.head.color;
      this._setHead();
      this.body.unshift(temp);
      this._setBody();
    }

    // 判断是否撞墙
    _dead() {
      switch (this.diretion) {
        case "right":
          if (this.head.left >= this.x - 1) {
            return true;
          } else {
            return false;
          }
        case "left":
          if (this.head.left <= 0) {
            return true;
          } else {
            return false;
          }
        case "top":
          if (this.head.top <= 0) {
            return true;
          } else {
            return false;
          }
        case "down":
          if (this.head.top >= this.y - 1) {
            return true;
          } else {
            return false;
          }
      }
    }

    _distory() {
      this.head.remove();
      this.body.forEach((it) => it.remove());
    }
  }
  window.Snake = Snake;
})();

// 食物对象的构建
(() => {
  class Food extends Base {
    constructor(opation) {
      opation = opation || {};
      super(opation.baseWidth);
      this.totalCount = opation.totalCount;
      this.parent = opation.parent;
      this.color = tools.getColor();
      this.x = opation.x;
      this.y = opation.y;
      this._init();
    }

    _init() {
      this._setFood();
      this.parent.append(this.content);
    }

    _setFood() {
      this.content.style.backgroundColor = this.color;
    }

    _initPosition(snake) {
      this.left = tools.getRandom(this.x);
      this.top = tools.getRandom(this.y);
      while (this._judge(snake)) {
        this.left = tools.getRandom(this.x);
        this.top = tools.getRandom(this.y);
      }
      this.initPosition();
    }

    _judge(snake) {
      if (this.judge(snake.head)) {
        return true;
      } else {
        for (let i = 0; i < snake.body.length; i++) {
          if (this.judge(snake.body[i])) {
            return true;
          }
        }
        return false;
      }
    }

    _distory() {
      this.remove();
    }
  }
  window.Food = Food;
})();

// 游戏对象的构建
(() => {
  class Game {
    constructor(opation) {
      opation = opation || {};
      this.opation = opation;
      opation.x = opation.parent.offsetWidth / opation.baseWidth;
      opation.y = opation.parent.offsetHeight / opation.baseWidth;
      this.parent = opation.parent;
      this.timeStep = opation.timeStep;
      this.grow = opation.grow;
      this._init();
    }

    // 初始化游戏
    _init() {
      this.snake = this._createSnake();
      this.food = this._createFood();
      this._initFood();
      this._initSnake();
    }

    // 构造蛇
    _createSnake() {
      return new Snake(this.opation);
    }

    _initSnake() {
      this._snakeDirector();
    }

    // 蛇的运动
    _snakeMove(time) {
      if (!this.lastTime) {
        this.lastTime = time;
        this.runId = requestAnimationFrame(this._snakeMove.bind(this));
      } else if (time - this.lastTime < this.timeStep) {
        this.runId = requestAnimationFrame(this._snakeMove.bind(this));
      } else {
        if (this.snake._dead()) {
          cancelAnimationFrame(this.runId);
          alert("game over");
        } else {
          if (this._snakeEat()) {
            this.snake._eat(this.food);
            this.food = this._createFood();
            this._initFood();
            this.grow();
          } else {
            let preLeft = this.snake.head.left;
            let preTop = this.snake.head.top;
            this.snake._director();
            this.snake.body.forEach((it) => {
              let currentLeft = it.left;
              let currentTop = it.top;
              it.left = preLeft;
              it.top = preTop;
              it.initPosition();
              preLeft = currentLeft;
              preTop = currentTop;
            });
          }
          this.lastTime = time;
          this.runId = requestAnimationFrame(this._snakeMove.bind(this));
        }
      }
    }

    _snakeEat() {
      let sTop = this.snake.head.top;
      let fTop = this.food.top;
      let sLeft = this.snake.head.left;
      let fLeft = this.food.left;
      if (this.snake.diretion == "right") {
        if (sTop == fTop && sLeft + 1 == fLeft) {
          return true;
        } else {
          return false;
        }
      } else if (this.snake.diretion == "left") {
        if (sTop == fTop && sLeft - 1 == fLeft) {
          return true;
        } else {
          return false;
        }
      } else if (this.snake.diretion == "top") {
        if (sLeft == fLeft && sTop - 1 == fTop) {
          return true;
        } else {
          return false;
        }
      } else if (this.snake.diretion == "down") {
        if (sLeft == fLeft && sTop + 1 == fTop) {
          return true;
        } else {
          return false;
        }
      }
    }

    start() {
      this.runId = requestAnimationFrame(this._snakeMove.bind(this));
    }

    pause() {
      cancelAnimationFrame(this.runId);
      this.lastTime = null;
    }

    // 添加方向监听
    _snakeDirector() {
      addEventListener("keydown", (e) => {
        if (this.flag) {
          if (e.code === "ArrowUp") {
            this.snake.diretion = "top";
          } else if (e.code === "ArrowDown") {
            this.snake.diretion = "down";
          } else if (e.code === "ArrowLeft") {
            this.snake.diretion = "left";
          } else if (e.code === "ArrowRight") {
            this.snake.diretion = "right";
          }
        }
      });
    }

    // 构造食物
    _createFood() {
      return new Food(this.opation);
    }

    _initFood() {
      this.food._initPosition(this.snake);
    }

    _distory() {
      this.food._distory();
      this.snake._distory();
    }
  }
  window.Game = Game;
})();

(() => {
  let opation = {
    parent: document.querySelector(".content"),
    baseWidth: 40,
    grow: () =>
      (document.querySelector("p").textContent =
        Number(document.querySelector("p").textContent) + 1),
    timeStep: 300,
  };
  let g = new Game(opation);
  // 获取按钮组
  let btns = document.querySelectorAll("button");
  g.flag = false;
  btns[0].addEventListener("click", (e) => {
    if (!g.flag) {
      g.flag = true;
      g.start();
    }
  });

  btns[1].addEventListener("click", (e) => {
    if (g.flag) {
      g.flag = false;
      g.pause();
    }
  });

  btns[2].addEventListener("click", (e) => {
    g.pause();
    g._distory();
    g = new Game(opation);
    document.querySelector("p").textContent = 0;
  });

  btns[3].addEventListener("click", (e) => {
    if (g.timeStep > 200) {
      g.timeStep -= 50;
    }
  });

  btns[4].addEventListener("click", (e) => {
    if (g.timeStep < 400) {
      g.timeStep += 50;
    }
  });
  window.g = g;
})();
