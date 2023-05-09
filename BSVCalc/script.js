function calculateEarnings() {
    var transactions = document.getElementById("transactions").value;
    var fee = document.getElementById("fee").value;
  
    if (transactions && fee) {
      var earningsSatoshis = transactions * fee;
      var earningsBSV = earningsSatoshis / 100000000;
      var earningsUSD = earningsBSV * 30; // Current price: 1 BSV = $30

      let formatting_options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 3,
     }
     // Format USD string
     let dollarString = new Intl.NumberFormat("en-US", formatting_options); 
  
      document.getElementById("earnings-satoshis").innerHTML = "Earnings in Satoshis: " + earningsSatoshis;
      document.getElementById("earnings-bsv").innerHTML = "Earnings in BSV: " + earningsBSV.toFixed(4);
      document.getElementById("earnings-usd").innerHTML = "Earnings in USD: " + dollarString.format(earningsUSD);
      document.getElementById("earnings-usd-annual").innerHTML = "Annual Earnings in USD: " + dollarString.format(earningsUSD * 12);
    } else {
      document.getElementById("result").innerHTML = "Please enter both values.";
    }
  }
  