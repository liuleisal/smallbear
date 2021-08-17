(function(){
  var main = {
    verSwiper:null,
    timer: null,
    isAnswe: false,
    phone:'',
    aswerArr:[],
    file:'',
    baseUrl:'http://47.106.95.183:8082/api',
    listData:[],
    videoIndex:-1,
    sign:'',
    tips: function(value,fn,that){
      const _this = this
      if(this.timer){
        return
      }
      $('#tipsText').text(value)
      $('#tips').fadeIn()
      this.timer = setTimeout(() => {
        clearInterval(_this.timer)
        _this.timer = null
        $('#tips').fadeOut()
        fn&&fn(that)
      },2000)
    },
    swiper: function(){
      this.verSwiper = new Swiper ('.swiper-vertical', {
        direction : 'vertical',
        lazy: {
          loadPrevNext: true,
        },
        on:{
          init: function(){
            swiperAnimateCache(this); //隐藏动画元素 
            swiperAnimate(this); //初始化完成开始动画
          }, 
          slideChangeTransitionEnd: function(){ 
            swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
            //this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); 动画只展现一次，去除ani类名
          } 
        }
      }) 
      new Swiper('.name1', {
        direction: 'vertical',
        roundLengths : true, 
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.name1 .swiper-scrollbar',
          dragSize:32,
          draggable: true,
        },
        mousewheel: true,
      });
      new Swiper('.name2', {
        direction: 'vertical',
        roundLengths : true, 
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.name2 .swiper-scrollbar',
          dragSize:32,
          draggable: true,
        },
        mousewheel: true,
      });
      new Swiper('.name3', {
        direction: 'vertical',
        roundLengths : true, 
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: '.name3 .swiper-scrollbar',
          dragSize:32,
          draggable: true,
        },
        mousewheel: true,
      });
    },
    clickEvt: function(){
      const _this = this
      $('#btn1').click(function(){
        let num = _this.getCookie('samllbear')||0
        if(num>1){
          _this.tips('您今天已投两票')
          return
        }
        _this.vote(_this,1).then(() => {
          _this.tips('投票成功')
          num = (parseInt(num)+1).toString()
          _this.addCookie('samllbear',num)
          const realnum = $('#num1').text()
          $('#num1').text(parseInt(realnum)+1)
        }).catch(() => {
          _this.tips('投票失败')
        })
      })
      $('#btn2').click(function(){
        let num = _this.getCookie('samllbear')||0
        if(num>1){
          _this.tips('您今天已投两票')
          return
        }
         _this.vote(_this,2).then(() => {
          _this.tips('投票成功')
          num = (parseInt(num)+1).toString()
          _this.addCookie('samllbear',num)
          const realnum = $('#num2').text()
          $('#num2').text(parseInt(realnum)+1)
        }).catch(() => {
          _this.tips('投票失败')
        })
      })
      $('#btn3').click(function(){
        let num = _this.getCookie('samllbear')||0
        if(num>1){
          _this.tips('您今天已投两票')
          return
        }
         _this.vote(_this,3).then(() => {
          _this.tips('投票成功')
          num = (parseInt(num)+1).toString()
          _this.addCookie('samllbear',num)
          const realnum = $('#num3').text()
          $('#num3').text(parseInt(realnum)+1)
        }).catch(() => {
          _this.tips('投票失败')
        })
      })

    },
    wxShare: function(){
      $.ajax({
        url:'//t-csbj.linkroutes.com/api/wx/signature',
        type: "POST",
        dataType: "json",
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        data:{
          url: encodeURIComponent(location.href.split('#')[0])
        },
        success: function(result){
          const {data} = result
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr, 
            signature: data.signature,
            jsApiList: [ 'onMenuShareTimeline','onMenuShareAppMessage'] 
          });
        },
        error: function(err){
          console.log('发生错误',err)
        }
      })
    },
    addCookie: function(name,value){
      var exp = new Date(new Date(new Date().getTime()).setHours(23,59,59,999))
      document.cookie = name + "=" + value + ";expires="+ exp.toGMTString(); 
    },
    getCookie: function(name){
      var strCookies = document.cookie;
        var array = strCookies.split(';');
        for (var i = 0; i < array.length; i++) {
            var item = array[i].split("=");
            if (item[0] == name) {
                return item[1];
            }
        }
        return null;
    },
    audioFn: function(){
      var audioPlayer = document.getElementById('music');
      document.addEventListener('DOMContentLoaded',function (){
      　　function audioAutoPlay(){
          　　document.addEventListener("WeixinJSBridgeReady", function () {
            　　audioPlayer.play()
                $('#musicCtr').addClass('music-current') 
          　　}, false)
      　　}
      　　audioAutoPlay()
      });
      $('#musicCtr').click(() => {
        if (audioPlayer.paused) {   
          audioPlayer.play()
          $('#musicCtr').addClass('music-current')
        }else{      
          audioPlayer.pause()
          $('#musicCtr').removeClass('music-current')   
        }
      })
    },
    vote: function(_this,id){
      return new Promise((resolve,reject) => {
        $.ajax({
          url:`${_this.baseUrl}/enroll/vote`,
          type: "POST",
          dataType: "json",
          contentType: 'application/json; charset=utf-8', 
          data: JSON.stringify({id}),
          success: function(result){
            const {code} = result
            if(code===200){
              resolve()
            }else{
              reject()
            }
          },
          error: function(err){
            resolve()
            console.log('发生错误',err)
          }
        })
      })
    },
    creatList: function(data,_this){
      if(!data||!data.length) return
      let content = ''
      for(let i=0;i<data.length;i++){
        content += `<div class="video-list">
                  <div class="video">
                    <video src="${data[i].videoUrl}" class="video-play" controls><video>
                  </div>
                  <div class="video-tip tips${i+1}">Top${i+1}</div>
                  <div class="video-mess">
                    <div class="video-message">
                      <div class="video-num">${data[i].enrollNo}</div>
                      <div class="video-name">${data[i].childName}</div>
                      <div class="video-ps">${data[i].voteNum}票</div>
                    </div>
                    <div class="video-dian"></div>
                  </div>
                </div>`
      }
      $('#content').html(content)
      $("#content .video-dian").unbind("click");
      $('#content .video-dian').click(function(){
        let num = _this.getCookie('samllbear')||0
        const index = $("#content .video-dian").index(this)
        const {id,voteNum} = _this.listData[index]
        if(num>4){
          _this.tips('您今天已投五票')
          return
        }
        _this.vote(_this,id).then(() => {
          _this.tips('投票成功')
          _this.listData[index].voteNum = parseInt(voteNum+1)
          $('#content .video-ps').eq(index).text(parseInt(voteNum+1)+'票')
          num = (parseInt(num)+1).toString()
          _this.addCookie('samllbear',num)

        }).catch(() => {
          _this.tips('投票失败')
        })
      })
      const fun = function(event){
        $('audio,video').each(function (index, item) {
            if (item !== event.target) {
                item.pause();
            }
        });
      }
      $('video').off('playing', fun);
      $('video').on('playing', fun);
    },
    rankList:function(){
      const _this = this
      $.ajax({
        url:`${_this.baseUrl}/enroll/voteIndexList`,
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8', 
        data: JSON.stringify({sign:_this.sign}),
        success: function(result){
          const {code,data:{indexList}} = result
          if(code===200){
            indexList.forEach((item) => {
              if(item.id===1){
                $('#num1').text(item.num)
              }else if(item.id===2){
                $('#num2').text(item.num)
              }else if(item.id===3){
                $('#num3').text(item.num)
              }
            })
          }
        },
        error: function(err){
          console.log('发生错误',err)
        }
      })
    },
    getQueryVariable:function(variable){
      var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    },
    init: function(){
      if(location.href.indexOf('https')>-1){
        location.href = location.href.replace('https','http')
        return
      }
      const mobileHeight = window.innerHeight
      $('.swiper-name').height(mobileHeight-180)
      this.wxShare()
      this.swiper()
      this.clickEvt()
      this.rankList()
      // this.audioFn()
    }
  }
  main.init()
})()