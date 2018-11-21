$(document).ready(function () {
  var timeData = [],
  CurrentPositionLat = [],
  CurrentPositionLong = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Latitude',
        yAxisID: 'Latitude',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: CurrentPositionLat
      },
      {
        fill: false,
        label: 'Longitude',
        yAxisID: 'Longitude',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: CurrentPositionLong
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Vehicle position latitude and longitude Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Latitude',
        type: 'linear',
        scaleLabel: {
          labelString: 'Latitude',
          display: true
        },
        position: 'left',
      }, {
          id: 'Longitude',
          type: 'linear',
          scaleLabel: {
            labelString: 'Longitude',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.EventTimestamp || !obj.CurrentPositionLat) {
        return;
      }
      timeData.push(obj.EventTimestamp);
      CurrentPositionLat.push(obj.CurrentPositionLat);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        CurrentPositionLat.shift();
      }

      if (obj.CurrentPositionLong) {
        CurrentPositionLong.push(obj.CurrentPositionLong);
      }
      if (CurrentPositionLong.length > maxLen) {
        CurrentPositionLong.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});