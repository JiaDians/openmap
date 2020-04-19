window.onload = function(){

var mapSketch = function(p5j){
    p5j.bus;
    p5j.loaded = 0; // 確認是否有讀取檔案
    p5j.map = L.map('map').setView([23.8,121], 7.5); // 經緯度 比例

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(p5j.map); // 將openstreetmap資料下載到 畫面中



    p5j.preload = function() { // 需要先讀取 json
      // 取得日期段內的強度大於3的地震
      let url = './myfile/data.json';

      p5j.httpGet(url, 'json', false, function(response) {
        p5j.bus = response; // 會把所有回呼資料存於 earthquakes
      });
    }

    p5j.setup = function(){
    }
    p5j.draw = function(){

      if (!p5j.bus) {
        // Wait until the earthquake data has loaded before drawing.
        return;
      }else {
          if (p5j.loaded === 1){
          console.log(p5j.bus.datas[0]);


          p5j.bus.datas.forEach((val)=>{
          	
            L.circle([val.Latitude, val.Longitude], { // 緯度在前面
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 1,
                stroke: false, // 取消邊線
                radius: 500 // 強度 乘上大小單位為公尺
            }).addTo(p5j.map).bindPopup('公車編號:<span style="color:blue;">'+ val.BusID + '</span><br>公車速度:<span style="color:red;">' + val.Speed + "</span> km/hr");
          });
        }
    
        p5j.loaded +=1;
      }    
  }
}
  
new p5(mapSketch, 'map');
}