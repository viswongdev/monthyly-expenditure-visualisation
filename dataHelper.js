export let data = {
  totalMonths : null,
  currentMonth : null,
  expenses : [],
  fetchExpensesData: async function(callback, url) {
    let fetch_data = await fetch(url)
    let data = await fetch_data.json();
    // formatting the data
    data.GoogleSheetData.shift();
    let keyName = data.GoogleSheetData[0];
    data.GoogleSheetData.shift();
    data.GoogleSheetData.forEach((item) => {
      let obj = {};
      item.forEach((value, index) => {
        if (keyName[index] === 'Month') {
          // console.log(value);
          switch (value) {
            case 1:
              value = 'Jan';
              break;
            case 2:
              value = 'Feb';
              break;
            case 3:
              value = 'Mar';
              break;
            case 4:
              value = 'Apr';
              break;
            case 5:
              value = 'May';
              break;
            case 6:
              value = 'Jun';
              break;
            case 7:
              value = 'Jul';
              break;
            case 8:
              value = 'Aug';
              break;
            case 9:
              value = 'Sep';
              break;
            case 10:
              value = 'Oct';
              break;
            case 11:
              value = 'Nov';
              break;
            case 12:
              value = 'Dec';
              break;
            default:
              break;
          }
          obj[keyName[index]] = value;
        } else {
          obj[keyName[index]] = Math.round(value);
        }
      });
      this.expenses.push(obj);
    });
    this.totalMonths = this.expenses.length - 1;
    this.currentMonth = this.totalMonths;
    callback();
  }
}