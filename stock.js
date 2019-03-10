document.getElementById("Add").onclick = addList;
var price_list = [];
var set = setInterval(updateChart, 5000);
google.charts.load('current', {
  packages: ['corechart', 'bar']
});


//Function to add stock to the list
function addList() {
  var x = document.getElementById("stock_name").value;
  callAPI(x, 0, -1); //calling API to add stock to list
}


//Function to draw chart for stock prices
function drawBarColors() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Share');
  data.addColumn('number', 'share price');
  data.addColumn({
    type: 'string',
    role: 'annotation'
  });
  data.addRows(price_list);

  var options = {
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 14,
      }
    },
    title: 'Stock Prices',
    chartArea: {
      width: "50%",
      height: "50%"
    },
    height: 300,
    colors: ['#0000CD', '#ffab91'],
    hAxis: {
      title: 'value per share',
      minValue: 0
    },
    vAxis: {
      title: 'Stock'
    }
  };
  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

//Function to update the chart every 5 seconds
function updateChart() {
  if (price_list.length > 0) {
    for (var i = 0; i < price_list.length; i++) {
      console.log(price_list[i][0] + "++" + price_list[i][1]);
      callAPI(price_list[i][0], price_list[i][1], i);
    }
  }
}

//Calling API to get the prices and populating the price_list
function callAPI(x, old_price, flag) {
  var url = "https://api.iextrading.com/1.0/stock/" + x + "/price";
  fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      var stock_price = [x, data, data.toString()];
      if (flag == -1) //if condition to enter the new stock price in the list
      {
        html_to_insert = "<li>" + x + "</li>";
        document.getElementById('list').insertAdjacentHTML('beforeend', html_to_insert); //Adding element in the 
        //HTML code
        price_list.push(stock_price); //Adding the price into the list

      } else //else condition for new price
      {
        if (old_price < data)
          price_list.splice(flag, 1, [x, data, data.toString() + " ▲" + (data - old_price).toFixed(3).toString()]);
        else {
          if (old_price > data)
            price_list.splice(flag, 1, [x, data, data.toString() + " ▼" + (old_price - data).toFixed(3).toString()]);
        }
      }

      drawBarColors(); //calling function to show chart for the prices
    })
    .catch(function() {
      alert("Cannot find Stock with that symbol") //to handle error
    });
}
