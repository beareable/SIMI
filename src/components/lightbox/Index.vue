<template>
  <div class="pic-box" style="display:none;">
    <div class="pic-box-modal" @click="handleClose">
      <div class="modal-close-btn"></div>
    </div>
    <img ref="showImg" data-rotate="0" v-drag-and-drop :src="imgSrc" class="pic-box-img"/>
    <div class="pic-box-btns">
      <div class="pic-box-caption" ref="imgCaption"></div>
      <div class="pic-box-nav">
        <a class="nav-left-btn" href="#" @click="rotateImage(false)"></a>
        <a class="nav-prev-btn" href="#" @click="handlePrev"></a>
        <a class="nav-zoom-btn" href="#" @click="handleZoom()"></a>
        <a class="nav-right-btn" href="#" @click="rotateImage(true)"></a>
        <a class="nav-next-btn" href="#" @click="handleNext"></a>
      </div>
      <div class="pic-box-number" ref="imgNumber"></div>
    </div>
  </div>
</template>
<script>
/**
页面调用示例：
      //加载组件
      <Lightbox :images="lightBoxImgs" ref="lightbox"></Lightbox>

      //页面渲染完后，获取到所有图片地址，并调用handleLightbox方法给图片添加点击事件
      const imgsEl = document.querySelectorAll(".item-content img");
			if(imgsEl.length > 0){
				this.handleLightbox(imgsEl);
			}

      //给图片添加lightbox放大效果(这是通用处理方法)
			handleLightbox(imgs){
        this.lightBoxImgs = [];//这里重置数据，避免因上一次数据缓存出现bug
        if(imgs.length > 0){
            for (let i=0; i<imgs.length; i++) {
                if(imgs[i].src){
                    if(imgs[i].src)this.lightBoxImgs.push({
                        src:imgs[i].src,
                        thumb:imgs[i].src,
                        caption:'',
                    });
                    imgs[i].onclick = ()=>{  
                        this.$refs.lightbox.showImage(i);
                    }  
                }
            }
        }
			}
 */
  import Vue from 'vue';
  //图片拖动实现
  Vue.directive('drag-and-drop', {
    bind: function (el, binding, vnode) {
        let mX = 0, mY = 0;//定义鼠标X轴Y轴
        let dX = 0, dY = 0;//定义div左、上位置

        let handleDragStart = function(e){
          mX = event.clientX;
          mY = event.clientY;
          dX = e.target.offsetLeft;
          dY = e.target.offsetTop;
        }
        let handleDragEnter = function(e){
          e.preventDefault();
        }
        let handleDragOver = function(e){
          e.preventDefault();
        }
        let handleDrag = function(e){
          e.preventDefault();
          let top = e.target.offsetTop+document.body.scrollTop;
          let left = e.target.offsetLeft;

          let x = event.clientX;//鼠标滑动时的X轴
          let y = event.clientY;//鼠标滑动时的Y轴
                
          e.target.style.top = (y - mY + dY)+ "px";
          e.target.style.left = ( x - mX + dX)+ "px";

        }
        let handleDragLeave = function(){
            
        }
        let handleDragEnd = function(e){
          //e.stopPropagation();
          e.preventDefault();
          let top = e.clientX;
          let left = e.clientY;

          let x = event.clientX;//鼠标滑动时的X轴
          let y = event.clientY;//鼠标滑动时的Y轴
                
          e.target.style.top = (y - mY + dY)+ "px";
          e.target.style.left = ( x - mX + dX)+ "px";
            
        }
        let handleDrop = function(e){
          e.preventDefault();
        }

        el.addEventListener('dragstart', handleDragStart, false);
        el.addEventListener('dragenter', handleDragEnter, false);
        el.addEventListener('dragover', handleDragOver, false);
        el.addEventListener('drag', handleDrag, false);
        el.addEventListener('dragleave', handleDragLeave, false);
        el.addEventListener('dragend', handleDragEnd, false);
        el.addEventListener('drop', handleDrop, false);
    },
    update: function (newValue, oldValue) {
      
    },
    unbind: function (el) {
      el.classList.remove('dragging', 'drag-over', 'drag-enter');
      el.removeAttribute('draggable');
    }
  });
export default {
  props: {
    /**
     * 数组格式：[{src:'',thumb:'',caption:''}]
     */
    images: {
      type: Array,
      default: [],
      required: true,
    },
  },

  data() {
    return {
      countImages:0,
      imgSrc:'',
      zoomStatus:0,
      prevStatus:0,
      nextStatus:0,
      currIndex:0,
      currentSize:1,//滚动基数
      middleX:0,
      middleY:0,
      imageX:0,
      imageY:0,
      imgObj:null,
      navbtnsImg:'data:image/png;base64,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'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBtnBackGround('left','-159px 0');
      this.setBtnBackGround('right','-377px 0');
      this.setBtnPrev(0);
      this.setBtnZoom(0);
      this.setBtnNext(0);
      this.$refs.imgCaption.style.display = 'none';//inline-block
    });

    this.middleX = window.innerWidth / 2;
		this.middleY = window.innerHeight / 2;

    //document.addEventListener('mousewheel', this.scrollZoom);
  },
  destroyed(){
    //document.removeEventListener('mousewheel', this.scrollZoom);
  },
  watch: {
    images(newVal,oldVal){
      this.countImages = newVal.length;
    },
  },

  methods: {
    /**
     * 外部调用此方法展示图片（点击图片时调用）
     * params int index 对应数组this.images下标值（即当前要展示的图片）
     */
    showImage(index){
      this.$el.style.display = 'block';
      this.$refs.showImg.style.display = 'inline-block';
      this.currIndex = index;
      this.imgSrc = this.images[index].src;
      this.$refs.showImg.setAttribute("data-rotate", 0);
      this.$refs.showImg.style.transform = "rotate(0deg)";
      this.setImgZoom(false);
      this.$nextTick(() => {//等待图片加载后再执行此方法
        this.imgObj = new Image();
        this.imgObj.src = this.$refs.showImg.src;
        let imgW = this.imgObj.width;
        let imgH = this.imgObj.height;
        const bodyW = document.body.clientWidth;
        const bodyH = window.innerHeight;
        let top = (bodyH - imgH)/2;
        let left = (bodyW - imgW)/2;
        if(top <= 0 && left <=0) { // 图片宽和高都超过浏览器宽高
          this.setBtnZoom(1);
        }else{
          this.setBtnZoom(0);
        }
        //上一张、下一张按钮的显示处理
        this.setBtnPrev(index);
        this.setBtnNext(index);

        this.imageX = this.middleX;
        this.imageY = this.middleY;

        this.resizeImage(1);//初始化图片大小

        document.addEventListener('mousewheel', this.scrollZoom);

      });
    },
    handleClose(){
      this.$el.style.display = 'none';
      this.imgObj = null;
      document.removeEventListener('mousewheel', this.scrollZoom);
    },
    handlePrev(){
      if(this.currIndex > 0){
        this.currIndex -= 1;
      }else{
        return false;
      }
      this.showImage(this.currIndex);
    },
    handleNext(){
      if(this.currIndex < (this.countImages - 1)){
        this.currIndex += 1;
      }else{
        return false;
      }
      this.showImage(this.currIndex);
    },
    handleZoom(){
      if(this.zoomStatus == 1){
        this.setImgZoom(true);
        this.zoomStatus = 2;
      }else if(this.zoomStatus == 2){
        this.setImgZoom(false);
        this.zoomStatus = 1;
      }else{
        this.zoomStatus = 0;
      }
      this.setBtnZoom(this.zoomStatus);
    },
    scrollZoom(e){
      let delta = -e.deltaY/100;
      let to = this.currentSize + delta * this.currentSize / 10;
		  return this.resizeImage(to);
    },
    resizeImage(to, noAnim) {
      if(!this.imgObj){
        return false;
      }

      let amount = to / this.currentSize;
      this.imageX = this.middleX - (this.middleX - this.imageX) * amount;
      this.imageY = this.middleY - (this.middleY - this.imageY) * amount;

      this.currentSize = to;

      let	width = this.imgObj.width * to,
          height = this.imgObj.height * to,
          // round these as some browsers don't like very small css values
          left = this.imageX - (width / 2) >> 0,
          top = this.imageY - (height / 2) >> 0,
          dur = 300;

      this.$refs.showImg.width = width;
      this.$refs.showImg.height = height;
      this.$refs.showImg.style.top = top + 'px';
      this.$refs.showImg.style.left = left + 'px';
      this.$refs.showImg.style.maxWidth = 'none';
      
      if(to != 1){
        //this.setBtnZoom(2);
      }
      return false;
    },
    setBtnPrev(index){
      if(index > 0){
        this.setBtnBackGround('prev','-223px 0');
      }else{
        this.setBtnBackGround('prev','-521px 0');
      }
    },
    /**
     * params int zoomStatus 0：没有放大，1：放大，2：还原
     */
    setBtnZoom(zoomStatus){
      if(zoomStatus == 1){
        this.setBtnBackGround('zoom','-263px 0');//可放大
      }else if(zoomStatus == 2){
        this.setBtnBackGround('zoom','0 0');//可缩小
      }else{
        this.setBtnBackGround('zoom','-74px 0');//不可点状态
      }
      this.zoomStatus = zoomStatus;
    },
    setBtnNext(index){
      if(index < (this.countImages - 1)){
        this.setBtnBackGround('next','-337px 0');
      }else{
        this.setBtnBackGround('next','-560px 0');
      }
    },
    setBtnBackGround(btnName,position){
      const btnEl = document.querySelectorAll(".nav-"+btnName+"-btn")[0];
      btnEl.style.background = "url("+this.navbtnsImg+") no-repeat";
      btnEl.style.backgroundPosition = position;
    },
    /**
     * 图片放大、还原
     * params blooean clockwise  true: 原图大小展示 | false: 设定大小显示
     */
    setImgZoom(isZoom){
      this.$nextTick(() => {//等待图片加载后再执行此方法
        this.imgObj = new Image();
        this.imgObj.src = this.$refs.showImg.src;
        let imgW = this.imgObj.width;
        let imgH = this.imgObj.height;

        const bodyW = document.body.clientWidth;
        const bodyH = window.innerHeight;

        const bodyW_valid = isZoom?bodyW:bodyW * 0.8;  //实际屏幕可用宽度(放大时为正常宽度)
        const bodyW_invalid = isZoom?0:bodyW * 0.2;  //屏幕留白宽度(放大时为没有留白)
        let top = (bodyH - imgH)/2;
        let left = (bodyW - imgW)/2;

        if(top <= 0 && left <=0) { // 图片宽和高都超过浏览器宽高
          imgH = imgH * ( bodyW_valid / imgW );//根据实际屏幕宽度计算图片缩小的高度
          left = bodyW_invalid / 2;
          top = isZoom?0:(bodyH - imgH) / 2; //如果是放大则top为0
        }else if(left <= 0) {
          imgH = imgH * ( bodyW_valid / imgW );
          top = (bodyH - imgH) / 2;
          left = bodyW_invalid / 2 ;
        }else if(top <= 0) {
          left = (bodyW - imgW) / 2 ;
        }

        if(!isZoom){
          //判断如果图片大于页面高宽，则设置图片大小为页面可见大小
          this.$refs.showImg.style.width = 'none';
          this.$refs.showImg.style.height =  'none';
          this.$refs.showImg.style.maxWidth = '80%';
        }else{
          //设置图片以原大小显示
          this.$refs.showImg.style.maxWidth = 'none';
        }

        this.$refs.showImg.style.top = ( top < 0 ? 0 :  top ) + "px";
        this.$refs.showImg.style.left = ( left < 0 ? 0 :left ) + "px";
      });
    },

    /**
     * 图片的旋转
     * params blooean clockwise  true: 顺时针旋转 | false: 逆时针旋转
     */
    rotateImage(clockwise) {
      let deg = parseInt(this.$refs.showImg.getAttribute("data-rotate"));
      if(clockwise){
        deg = (deg + 1) % 4;
      }else{
        if(deg == 0){
          deg = 3;	
        }else{
          deg = (deg - 1) % 4;
        }
      }
      this.$refs.showImg.style.transform = "rotate(" + (deg * 90) + "deg)";
      this.$refs.showImg.setAttribute("data-rotate", deg);
      return false;
    }
  }
}
</script>
<style lang="less" scoped>
.pic-box{
  .pic-box-modal{
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000;
    cursor: pointer;
    position: fixed;
    z-index: 999999;
    opacity: 0.8;

    .modal-close-btn{
      top: 0;
      right: 0;
      display: block;
      width: 50px;
      height: 50px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC9UExURQAAAAcHB/b29pycnAEBAQoKCgYGBv////7+/uXl5Tw8PHZ2dsjIyGZmZh4eHoCAgLS0tObm5jo6OmlpaUNDQ93d3TExMe/v7/f39/Ly8vj4+AQEBPr6+vv7+xcXFxISEv39/ePj4/T09PPz8+3t7d/f3/n5+TQ0NC4uLpiYmC8vL+7u7isrK6ioqH5+fqGhob+/v8fHx/Hx8c3NzcHBwbGxsa2traOjo+vr6+zs7HBwcFtbW6enp6WlpeDg4ITw+AIAAAG0SURBVEjH7ZVpe4IwDICRK0FQQUQBdd735jXPXf//Z60URZAi8PhxyxfaJC9pmzbhuH9hiEgkh/vLvjfsj93+sHd4yQS8OwiBoLNJBd5sIMQFoiN79RBoNogPAi+YtXq9Zgo8nTaaycRr2/PQqzdNVfeg9jyJ+ERE0MpRZVkDol4mxPAINa5XPWbK3EebEEWWpUiYVoFhaCQRPtNgnC45VDVplyoxCjGtjajRQakSWkOhUqJfDdGO5Zz8h55VCcCQrlrJAKBMmZh3d4iDqNNBhWRckX2lrJD8V+hQR3TubiKx+RksGCR3Co0jEQINf5lVgG4nguwB+OtiPEcvjqwEMBEe4CuC9ACDE7m4BqgvAsIo8oKGAGYwoc6WFY7BcSbAOYyIfYDabUrjRGJwXA1gEEHGAPXQXLK8p2JJIVUdwH0Wyb+wbNs/iU8e8iFLKo/PXpgs13J7d5M36Zd/nfuJ8bEavUp7yLPc5WIh5i5KMssyf1T6Juz4y+QC+5HUn6YtdhlvTZI7WoHZLBbyww4jxFoSP0ttmjune2t83e06U5ftfP+cB647OI2OnVwtPGcb/zPyC0BiIujGAs8SAAAAAElFTkSuQmCC) no-repeat top left;
      position: fixed;
      z-index: 999999;
    }
  }

  .pic-box-img{
    top: 174px;
    left: 103px;
    transform: rotate(0deg);
    overflow: hidden;
    border: none;
    background: #000 no-repeat;
    -moz-box-shadow: 0 0 40px #000;
    -webkit-box-shadow: 0 0 40px #000;
    box-shadow: 0 0 40px #000;
    cursor: move;
    position: fixed;
    z-index: 999999;
  }
  .pic-box-btns{

    font-family: Verdana, Arial, Geneva, Helvetica, sans-serif;
    font-size: 10px;
    text-align: center;
    color: #EEE;
    line-height: 1.4em;
    left: 50%;
    bottom: 10px;
    width: 400px;
    margin-left: -200px;
    position: fixed;
    z-index: 999999;

    .pic-box-caption{
      font-weight: bold;
      padding: 4px;
      display: inline-block;
      background-color: rgba(0, 0, 0, 0.7);
      filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#B0000000, EndColorStr=#B0000000);
      zoom: 1;
    }

    .pic-box-nav{

      display: block;
      width: 282px;
      height: 70px;
      margin: auto;
      margin-top: 5px;

      .nav-left-btn{
        background-position: -159px 0;
        width: 64px;
        float: left;
        display: inline-block;
        height: 70px;
        outline: none;
        text-indent: -9000px;
      }
      .nav-prev-btn{
        background-position: -521px 0;
        width: 40px;
        float: left;
        display: inline-block;
        height: 70px;
        outline: none;
        text-indent: -9000px;
        
      }
      .nav-zoom-btn{
        width: 74px;
        background-position: -74px 0;
        float: left;
        display: inline-block;
        height: 70px;
        outline: none;
        text-indent: -9000px;
      }
      .nav-right-btn{
        background-position: -377px 0;
        width: 64px;
        float: right;
        display: inline-block;
        height: 70px;
        outline: none;
        text-indent: -9000px;
      }
      .nav-next-btn{
        background-position: -560px;
        width: 40px;
        float: right;
        display: inline-block;
        height: 70px;
        outline: none;
        text-indent: -9000px;
      }
    }
  }
}

</style>