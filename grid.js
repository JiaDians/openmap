window.onload = function(){

var mapSketch = function(p5j){
    p5j.busData;
    p5j.loaded = 0; // 確認是否有讀取檔案
    p5j.map = L.map('map').setView([23.8,121], 7.5); // 經緯度 比例
    p5j.arr = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(p5j.map); // 將openstreetmap資料下載到 畫面中


    // 特別顯示層
    p5j.sp1= new L.LayerGroup();
    p5j.sp2= new L.LayerGroup();
    p5j.sp3= new L.LayerGroup();

    p5j.overlaying = {
        "公車速度0~20 (km/hr)": p5j.sp3,
        "公車速度20~40 (km/hr)": p5j.sp2,
        "公車速度40~ (km/hr)": p5j.sp1
    };   
    L.control.layers(p5j.baseLayer, p5j.overlaying).addTo(p5j.map); // 添加層

    // oop
    var bus = function (Latitude,Longitude,sp,id){
      // 初始化     
      this.Latitude = Latitude;
      this.Longitude = Longitude;
      this.Speed = sp;
      this.Id = id;

      if (this.Speed>=0 && this.Speed<20){
        this.color = '#ff9900';
        this.layerGroup = p5j.sp3;
      }else if (this.Speed>=20 && this.Speed<40){
        this.color = '#ff0200';
        this.layerGroup = p5j.sp2;
      }else {
        this.color = '#020295';
        this.layerGroup = p5j.sp1;
      }
      // 定義 marker 物件
      this.marker = L.circle([this.Latitude, this.Longitude], { // 緯度在前面
                color: this.color,
                fillOpacity: 1,
                stroke: false, // 取消邊線
                radius: 100 // 強度 乘上大小單位為公尺
              });
      this.marker.addTo(this.layerGroup).bindPopup(
                  '公車編號:' +
                  '<span style="color:blue;">'+ this.Id + '</span><br>'+ 
                  '公車速度:'+
                  '<span style="color:red;">' + this.Speed + '</span>' +' km/hr<br>' + 
                  '公車位置:<br>' + 
                  '緯度=' + this.Latitude + '<br>' +
                  '經度=' + this.Longitude);
    }



    p5j.preload = function() { // 需要先讀取 json
      // 取得日期段內的強度大於3的地震
      let url = './myfile/data.json';

      p5j.httpGet(url, 'json', false, function(response) {
        p5j.busData = response; // 會把所有回呼資料存於 earthquakes
      });
    }

    p5j.setup = function(){
    }
    p5j.draw = function(){
      
      //console.log(p5j.mouseY);
      if (!p5j.busData) {
        // Wait until the earthquake data has loaded before drawing.
        return;
      }else {
          if (p5j.loaded === 1){
          console.log(p5j.busData.datas[0]);
          //console.log(p5j.map);
          p5j.busData.datas.forEach((val)=>{
            p5j.arr.push(new bus(val.Latitude, val.Longitude, val.Speed, val.BusID));
          });

        }
        else{
          p5j.arr.forEach((q)=>{
                  //q.curentFrame = (p5j.loaded+q.currentFrame);
                  //q.update();
              });
        }
        p5j.loaded +=1;
      }    
  }
}
  
new p5(mapSketch, 'map');
}