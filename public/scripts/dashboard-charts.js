

makeChart01 = function (data, divId, timeStart, timeEnd) {
    chart01 = AmCharts.makeChart(divId,
    {
        "type": "serial",
        "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
        "categoryField": "category",
        "rotate": true,
        "angle": 30,
        "depth3D": 30,
        "startDuration": 1,
        "fontSize": 16,
        "theme": "black",
        "categoryAxis": {
            "gridPosition": "start"
        },
        "trendLines": [],
        "graphs": [
            {
                "balloonText": "[[value]]",
                "fillAlphas": 1,
                "id": "AmGraph-1",
                "title": "จำนวนลูกค้า",
                "type": "column",
                "valueField": "column-1"
            }
        ],
        "guides": [],
        "valueAxes": [],
        "balloon": {},
        "legend": {
            "useGraphSettings": true
        },
        "titles": [
            {
                "text": ""
            }
        ],
        "allLabels": [
		    {
		        "text": "จำนวนลูกค้าต่อคิว/แบ่งตามเวลา",
		        "align": "center",
		        "size": "24"
		    },
            {
                "text": "ตั้งแต่ " + timeStart + " ถึง " + timeEnd,
                "align": "left",
                "y": "35",
                "size": "14"
            }
        ],
        "dataProvider": [
            {
                "category": "7.00-9.59",
                "column-1": data[0]
            },
            {
                "category": "10.00-11.59",
                "column-1": data[1]
            },
            {
                "category": "12.00-13.59",
                "column-1": data[2]
            },
            {
                "category": "14.00-15.59",
                "column-1": data[3]
            }
        ]
    });
}






makeChart02 = function (data, divId, timeStart, timeEnd) {
    chart02 = AmCharts.makeChart(divId,
	{
	    "type": "serial",
	    "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
	    "categoryField": "category",
	    "angle": 30,
	    "depth3D": 30,
	    "startDuration": 1,
	    "fontSize": 16,
	    "theme": "black",
	    "categoryAxis": {
	        "gridPosition": "start"
	    },
	    "trendLines": [],
	    "graphs": [
            {
                "fillAlphas": 1,
                "id": "AmGraph-1",
                "title": "2 เก้าอี้",
                "type": "column",
                "valueField": "2 Chairs"
            },
            {
                "fillAlphas": 1,
                "id": "AmGraph-2",
                "title": "4 เก้าอี้",
                "type": "column",
                "valueField": "4 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#FFAC00",
                "id": "AmGraph-3",
                "lineColor": "#FFAC00",
                "title": "6 เก้าอี้",
                "type": "column",
                "valueField": "6 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#9400D3",
                "id": "AmGraph-4",
                "lineColor": "#9400D3",
                "title": "8 เก้าอี้",
                "type": "column",
                "valueField": "8 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#45E029",
                "id": "AmGraph-5",
                "title": "มากกว่า 8",
                "type": "column",
                "valueField": ">8 Chairs"
            }
	    ],
	    "guides": [],
	    "valueAxes": [
            {
                "id": "ValueAxis-1",
                "title": "จำนวนลูกค้า"
            }
	    ],
	    "allLabels": [
		    {
		        "text": "จำนวนลูกค้าต่อคิว/แบ่งตามเก้าอี้",
		        "align": "center",
		        "size": "24"
		    },
            {
                "text": "ตั้งแต่ " + timeStart + " ถึง " + timeEnd,
                "y": "35",
                "align": "left",
                "size": "14"
            }
	    ],
	    "balloon": {},
	    "legend": {
	        "useGraphSettings": true
	    },
	    "titles": [
            {
                "text": ""
            }
	    ],
	    "dataProvider": [
            {
                "category": "",
                "2 Chairs": data[0],
                "4 Chairs": data[1],
                "6 Chairs": data[2],
                "8 Chairs": data[3],
                ">8 Chairs": data[4]
            }
	    ]
	});
}



makeChart03 = function (data, divId, timeStart, timeEnd) {
    chart03 = AmCharts.makeChart(divId,
    {
        "type": "pie",
        "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        "titleField": "category",
        "valueField": "column-1",
        "backgroundColor": "#FF9E01",
        "fontSize": 18,
        "theme": "black",
        "balloon": {},
        "colors": [
            "yellow", "pink", "darkgreen", "darkorange", "blue", "violet", "red"
        ],
        "legend": {
            "align": "center",
            "markerType": "circle"
        },
        "allLabels": [
		    {
		        "text": "สัดส่วนลูกค้าต่อวัน",
		        "align": "center",
		        "size": "24"
		    },
            {
                "text": "ตั้งแต่ " + timeStart + " ถึง " + timeEnd,
                "y": "35",
                "align": "left",
                "size": "14"
            }
        ],
        "titles": [],
        "dataProvider": [
            {
                "category": "จันทร์",
                "column-1": data[0]
            },
            {
                "category": "อังคาร",
                "column-1": data[1]
            },
            {
                "category": "พุธ",
                "column-1": data[2]

            },
            {
                "category": "พฤหัสบดี",
                "column-1": data[3]
            },
            {
                "category": "ศุกร์",
                "column-1": data[4]
            },
            {
                "category": "เสาร์",
                "column-1": data[5]
            },
            {
                "category": "อาทิตย์",
                "column-1": data[6]
            }
        ]
    });
}


makeChart05Day = function (data, divId, amount) {

    var chartData = [];
    var day = 0;
    var startDate = new Date();
    startDate.setDate(startDate.getDate() - (amount - 1));

    for (day = 0; day < amount; day++) {
        var newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + day);

        chartData.push({
            "date": newDate,
            "column-1": data[day],
            "column-2": data[day + amount]
        });
    }

    chart05 = AmCharts.makeChart(divId,
	{
	    "type": "serial",
	    "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
	    "categoryField": "date",
	    "dataDateFormat": "YYYY-MM-DD",
	    "theme": "black",
	    "categoryAxis": {
	        "parseDates": true
	    },
	    "chartCursor": {},
	    "chartScrollbar": {},
	    "trendLines": [],
	    "graphs": [
            {
                "bullet": "round",
                "id": "AmGraph-1",
                "lineColor": "#00FD05",
                "title": "ใช้คิว",
                "valueField": "column-1"
            },
            {
                "bullet": "round",
                "id": "AmGraph-2",
                "lineColor": "red",
                "title": "ทิ้งคิว",
                "valueField": "column-2"
            }
	    ],
	    "guides": [],
	    "valueAxes": [
            {
                "id": "ValueAxis-1",
                "title": "จำนวนผู้ใช้"
            }
	    ],
	    "allLabels": [],
	    "balloon": {},
	    "legend": {
	        "useGraphSettings": true
	    },
	    "titles": [
	    ],
	    "allLabels": [
		    {
		        "text": "สัดส่วนการใช้คิวและการทิ้งคิว",
		        "align": "center",
		        "size": "24"
		    }
	    ],
	    "dataProvider": chartData
	});
}

makeChart05Month = function (data, divId, amount) {

    var chartData = [];
    var month = 0;
    var startMonth = new Date();
    startMonth.setMonth(startMonth.getMonth() - (amount - 1));

    for (month = 0; month < amount; month++) {
        var newMonth = new Date(startMonth);
        newMonth.setMonth(newMonth.getMonth() + month);

        chartData.push({
            "date": newMonth.getFullYear() + "-" + (newMonth.getMonth() + 1),
            "column-1": data[month],
            "column-2": data[month + amount]
        });
    }

    chart05 = AmCharts.makeChart(divId,
	{
	    "type": "serial",
	    "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
	    "categoryField": "date",
	    "dataDateFormat": "YYYY-MM",
	    "theme": "black",
	    "categoryAxis": {
	        "minPeriod": "MM",
	        "parseDates": true
	    },
	    "chartCursor": {
	        "categoryBalloonDateFormat": "MMM YYYY"
	    },
	    "chartScrollbar": {},
	    "trendLines": [],
	    "graphs": [
            {
                "bullet": "round",
                "id": "AmGraph-1",
                "title": "ใช้คิว",
                "lineColor": "#00FD05",
                "valueField": "column-1"
            },
            {
                "bullet": "round",
                "fillColors": "#red",
                "lineColor": "red",
                "id": "AmGraph-2",
                "title": "ทิ้งคิว",
                "valueField": "column-2"
            }
	    ],
	    "guides": [],
	    "valueAxes": [
            {
                "id": "ValueAxis-1",
                "title": "จำนวนผู้ใช้"
            }
	    ],
	    "allLabels": [],
	    "balloon": {},
	    "legend": {
	        "useGraphSettings": true
	    },
	    "titles": [],
	    "allLabels": [
		    {
		        "text": "สัดส่วนการใช้คิวและการทิ้งคิว",
		        "align": "center",
		        "size": "24"
		    }
	    ],
	    "dataProvider": chartData
	});
}

makeChart05 = function (data, divId, filterBy, amount) {

    if (filterBy == 'day') {
        makeChart05Day(data, divId, amount);
    } else if (filterBy == 'month') {
        makeChart05Month(data, divId, amount);
    } else {
        alert('error: unknown filter by');
    }
}


makeChart06Day = function (data, divId, amount) {

    var chartData = [];
    var day = 0;
    var startDate = new Date();
    startDate.setDate(startDate.getDate() - (amount - 1));

    for (day = 0; day < amount; day++) {
        var newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + day);

        chartData.push({
            "date": newDate,
            "column-1": data[day]
        });
    }

    chart06 = AmCharts.makeChart(divId,
	{
	    "type": "serial",
	    "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
	    "categoryField": "date",
	    "dataDateFormat": "YYYY-MM-DD",
	    "theme": "black",
	    "categoryAxis": {
	        "parseDates": true
	    },
	    "chartCursor": {},
	    "chartScrollbar": {},
	    "trendLines": [],
	    "graphs": [
            {
                "fillAlphas": 0.7,
                "fillColors": "#F8E11F",
                "id": "AmGraph-1",
                "lineAlpha": 0,
                "title": "จำนวนผู้ใช้",
                "valueField": "column-1"
            }
	    ],
	    "guides": [],
	    "valueAxes": [
            {
                "id": "ValueAxis-1",
                "title": "จำนวนผู้ใช้"
            }
	    ],
	    "allLabels": [
             {
                 "text": "จำนวนการใช้แอพ",
                 "align": "center",
                 "size": "24"
             }
	    ],
	    "balloon": {},
	    "legend": {},
	    "titles": [],
	    "dataProvider": chartData
	});
}

makeChart06Month = function (data, divId, amount) {

    var chartData = [];
    var month = 0;
    var startMonth = new Date();
    startMonth.setMonth(startMonth.getMonth() - (amount - 1));

    for (month = 0; month < amount; month++) {
        var newMonth = new Date(startMonth);
        newMonth.setMonth(newMonth.getMonth() + month);

        chartData.push({
            "date": newMonth.getFullYear() + "-" + (newMonth.getMonth() + 1),
            "column-1": data[month]
        });
    }

    chart06 = AmCharts.makeChart(divId,
    {
        "type": "serial",
        "pathToImages": "http://cdn.amcharts.com/lib/3/images/",
        "categoryField": "date",
        "dataDateFormat": "YYYY-MM",
        "fontSize": 15,
        "theme": "black",
        "categoryAxis": {
            "minPeriod": "MM",
            "parseDates": true
        },
        "chartCursor": {
            "categoryBalloonDateFormat": "MMM YYYY"
        },
        "chartScrollbar": {},
        "trendLines": [],
        "graphs": [
            {
                "fillAlphas": 0.7,
                "fillColors": "#F8E11F",
                "id": "AmGraph-1",
                "lineAlpha": 0,
                "title": "จำนวนผู้ใช้",
                "valueField": "column-1"
            }

        ],
        "guides": [],
        "valueAxes": [
            {
                "id": "ValueAxis-1",
                "title": "จำนวนผู้ใช้"
            }
        ],
        "allLabels": [
             {
                 "text": "จำนวนการใช้แอพ",
                 "align": "center",
                 "size": "24"
             }
        ],
        "balloon": {},
        "legend": {},
        "titles": [],
        "dataProvider": chartData
    });
}


makeChart06 = function (data, divId, filterBy, amount) {

    if (filterBy == 'day') {
        makeChart06Day(data, divId, amount);
    } else if (filterBy == 'month') {
        makeChart06Month(data, divId, amount);
    } else {
        alert('error: unknown filter by');
    }
}

