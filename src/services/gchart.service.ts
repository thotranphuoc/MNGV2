import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()

export class GchartService {

    constructor(
    ) { }

    // draw a pie/bar chart
    drawChart(TITLE: string, WIDTH: number, HEIGHT: number, DATA_ARRAY: any[]) {
        return new Promise((resolve, reject) => {
            console.log('starting draw chart');
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Product');
            data.addColumn('number', 'Total');
            data.addRows(DATA_ARRAY);
            let options = {
                'title': TITLE,
                // 'width': WIDTH,
                // 'height': HEIGHT,
                // pieHole: 0.4
            }
            resolve({ data: data, options: options });
        })
    }

    // draw curving chart
    drawChartCurveLine() {
        return new Promise((resolve, reject) => {
            let data = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses'],
                ['2004', 1000, 400],
                ['2005', 1170, 460],
                ['2006', 660, 1120],
                ['2007', 1030, 540]
            ]);

            let options = {
                title: 'Company Performance',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            resolve({ data: data, options: options });
        })
    }

    drawMaterialChart() {
        return new Promise((resolve, reject) => {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Day');
            data.addColumn('number', 'G');
            data.addColumn('number', 'A');
            data.addColumn('number', 'T');

            data.addRows([
                [1, 37.8, 80.8, 41.8],
                [2, 30.9, 69.5, 32.4],
                [3, 25.4, 57, 25.7],
                [4, 11.7, 18.8, 10.5],
                [5, 11.9, 17.6, 10.4],
                [6, 8.8, 13.6, 7.7],
                [7, 7.6, 12.3, 9.6],
                [8, 12.3, 29.2, 10.6],
                [9, 16.9, 42.9, 14.8],
                [10, 12.8, 30.9, 11.6],
                [11, 5.3, 7.9, 4.7],
                [12, 6.6, 8.4, 5.2],
                [13, 4.8, 6.3, 3.6],
                [14, 4.2, 6.2, 3.4]
            ]);

            var options = {
                chart: {
                    title: 'Box Office Earn',
                    subtitle: 'M (USD)'
                },
                // width: 320,
                // height: 300
            };

            resolve({ data: data, options: options})

            //   var chart = new google.charts.Line(document.getElementById('linechart_material'));

            //   chart.draw(data, google.charts.Line.convertOptions(options));
        })
    }


}
