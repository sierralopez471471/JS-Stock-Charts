//I used Ting-Yu's solution but I understand their code and why they made certain decisions. It was very helpful. I had a really hard time with fetching

async function main() {
//used my personal api
    let apiKey = '4f0046390dff441d97cede907e0c6916';
    let endpoint = `https://api.twelvedata.com`;

    let symbols = ['GME', 'MSFT', 'DIS', 'BNTX'];
//cool way to condense everything and save time and lines of code
    let url = `${endpoint}/time_series?symbol=${symbols.join(',')}&interval=1day&apikey=${apiKey}`;

    let res = await fetch(url);
    let data = await res.json();

    if (!!data.code) {
        console.log('api request failed')
        data = mockData;
    }

    

    /* TIME CHART */

    const timeChartCanvas = document.querySelector('#time-chart');

    let datasets = [];
    let labels = Object.entries(data)[0][1].values.map(val => val.datetime);
    

    for (let symbol in data) {
        let obj = {};
        let values = data[symbol].values;
        obj.label = symbol;
        obj.data = values.map(val => val.high).reverse();
        obj.backgroundColor = ['rgba(255, 99, 132, 0.2)'];
        obj.borderColor = ['rgba(255, 99, 132, 1)'];
        obj.borderWidth = 1;
        datasets.push(obj);
    }

    

    const timeChart = new Chart(timeChartCanvas, {
        type: 'line',
        data: { labels: labels.reverse(), datasets },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    /* HIGHEST CHART */

    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');

    let highest = [];

    Object.entries(data).forEach(([ symbol, { meta, values }], idx) => {
        values.forEach(({ high }) => {
            if (highest[idx] == undefined || Number(high) > Number(highest[idx])) highest[idx] = high;
        })
    })

    console.log(highest);

    

    const highChart = new Chart(highestPriceChartCanvas, {
        type: 'bar',
        data: { labels: Object.keys(data), datasets: [{
            label: 'Highest Price',
            data: highest
        }]},
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });



    
}
main()
// my api key 4f0046390dff441d97cede907e0c6916