
/* make chart */

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
        "dataProvider": data.dataProvider
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
                "title": "1 เก้าอี้",
                "type": "column",
                "valueField": "1 Chairs"
            },
            {
                "fillAlphas": 1,
                "id": "AmGraph-2",
                "title": "2 เก้าอี้",
                "type": "column",
                "valueField": "2 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#FFAC00",
                "id": "AmGraph-3",
                "lineColor": "#FFAC00",
                "title": "3 เก้าอี้",
                "type": "column",
                "valueField": "3 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#9400D3",
                "id": "AmGraph-4",
                "lineColor": "#9400D3",
                "title": "4 เก้าอี้",
                "type": "column",
                "valueField": "4 Chairs"
            },
            {
                "fillAlphas": 1,
                "id": "AmGraph-5",
                "title": "5 เก้าอี้",
                "type": "column",
                "valueField": "5 Chairs"
            },
            {
                "fillAlphas": 1,
                "id": "AmGraph-6",
                "title": "6 เก้าอี้",
                "type": "column",
                "valueField": "6 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#FFAC00",
                "id": "AmGraph-7",
                "lineColor": "#FFAC00",
                "title": "7 เก้าอี้",
                "type": "column",
                "valueField": "7 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#9400D3",
                "id": "AmGraph-8",
                "lineColor": "#9400D3",
                "title": "8 เก้าอี้",
                "type": "column",
                "valueField": "8 Chairs"
            },
            {
                "fillAlphas": 1,
                "fillColors": "#45E029",
                "id": "AmGraph-9",
                "title": "9 เก้าอี้",
                "type": "column",
                "valueField": "9 Chairs"
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
	    "dataProvider": data.dataProvider
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
            "red", "yellow", "pink", "darkgreen", "darkorange", "blue", "violet"
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
        "dataProvider": data.dataProvider
    });
}


makeChart05Day = function (data, divId, amount) {

    //var chartData = [];
    //var day = 0;
    //var startDate = new Date();
    //startDate.setDate(startDate.getDate() - (amount - 1));

    //for (day = 0; day < amount; day++) {
    //    var newDate = new Date(startDate);
    //    newDate.setDate(newDate.getDate() + day);

    //    chartData.push({
    //        "date": newDate,
    //        "column-1": data[day],
    //        "column-2": data[day + amount]
    //    });
    //}

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
	    "dataProvider": data.dataProvider
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
	    "dataProvider": data.dataProvider
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

    //var chartData = [];
    //var day = 0;
    //var startDate = new Date();
    //startDate.setDate(startDate.getDate() - (amount - 1));

    //for (day = 0; day < amount; day++) {
    //    var newDate = new Date(startDate);
    //    newDate.setDate(newDate.getDate() + day);

    //    chartData.push({
    //        "date": newDate,
    //        "column-1": data[day]
    //    });
    //}

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
                "title": "จำนวนคนใช้แอพ",
                "valueField": "column-1"
            },
            {
                "fillAlphas": 0.7,
                "fillColors": "#F8E11F",
                "id": "AmGraph-2",
                "lineAlpha": 0,
                "title": "จำนวนคนไม่ใช้แอพ",
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
	    "dataProvider": data.dataProvider
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
            },
            {
                "fillAlphas": 0.7,
                "fillColors": "#F8E11F",
                "id": "AmGraph-2",
                "lineAlpha": 0,
                "title": "จำนวนคนไม่ใช้แอพ",
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
        "dataProvider": data.dataProvider
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




/* operation */

setDatePickerToElement = function (id, currentdate) {
    $(id).datepicker({ dateFormat: "d/m/yy" });
    $(id).val(currentdate.getDate() + "/" 
                + (currentdate.getMonth() + 1) + "/" 
                + currentdate.getFullYear());
}

$(document).ready(function () {
    var currentdate = new Date();
    var thisMonth;
    var thisDate;
    
    if ((currentdate.getMonth() + 1) < 10) {
        thisMonth = '0' + (currentdate.getMonth() + 1);
    } else {
        thisMonth = (currentdate.getMonth() + 1);
    }
    if ((currentdate.getDate()) < 10) {
        thisDate = '0' + currentdate.getDate();
    } else {
        thisDate = currentdate.getDate();
    }
    
    var shortcurrentdate = currentdate.getFullYear() + "-" + thisMonth + "-" + thisDate;
    
    setDatePickerToElement("#time-start", currentdate);
    setDatePickerToElement("#time-end", currentdate);
});



function convertDate(date) {
    var pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    var arrayDate = date.match(pattern);
    if (arrayDate[2] < 10) {
        arrayDate[2] = '0' + arrayDate[2];
    }
    if (arrayDate[1] < 10) {
        arrayDate[1] = '0' + arrayDate[1];
    }
    
    return arrayDate[3] + '-' + arrayDate[2] + '-' + arrayDate[1];
}



$("#time-button").click(function () {
    calloutChartSet1($('#company-dropdown').attr('data-selectedcompanyid'), false);
});

$("#filter-by").change(function () {
    if ($(this).val() == 'day') {
        makeChart05(JSON.parse(localStorage.getItem('chart05day')), "chartdiv05", 'day', '30');
        makeChart06(JSON.parse(localStorage.getItem('chart06day')), "chartdiv06", 'day', '30');
    } else {
        makeChart05(JSON.parse(localStorage.getItem('chart05month')), "chartdiv05", 'month', '30');
        makeChart06(JSON.parse(localStorage.getItem('chart06month')), "chartdiv06", 'month', '30');
    }

});

calloutChartSet1 = function (companyId, isRepeated) {
    var timeStart = $("#time-start").val() ?
                convertDate($("#time-start").val()) : shortcurrentdate;
    var timeEnd = $("#time-end").val() ?
                convertDate($("#time-end").val()) : shortcurrentdate;
    
    $.ajax({
        url: '/dashboardSectionOne',
        data: {
            TimeStart: timeStart,
            TimeEnd: timeEnd,
            CompanyId: companyId
        },
        type: 'POST',
        async: false,
        success: function (data) {
            //$.each(data[1].dataProvider, function (index, element) {
            //    alert(element['category']);
            //    alert(element['column-1']);
            //});
            
            makeChart01(data[0], "chartdiv01", timeStart, timeEnd);
            makeChart02(data[1], "chartdiv02", timeStart, timeEnd);
            makeChart03(data[2], "chartdiv03", timeStart, timeEnd);
        },
        complete: function () {
            if (isRepeated) {
                        //setTimeout(callout(true), 5000);
            }
        }
    });
}

calloutChartSet2 = function (companyId, isRepeated) {
    $.ajax({
        url: '/dashboardSectionTwo',
        data: {
            CompanyId: companyId
        },
        type: 'POST',
        async: false,
        success: function (data) {
            $("#currentonline").text('มีลูกค้า ' + data[0] + ' คนกำลังใช้แอพต่อคิวในขณะนี้');
            makeChart05(data[1], "chartdiv05", 'day', '30');
            makeChart06(data[2], "chartdiv06", 'day', '30');
            
            localStorage.setItem("chart05day", JSON.stringify(data[1]));
            localStorage.setItem("chart06day", JSON.stringify(data[2]));
            localStorage.setItem("chart05month", JSON.stringify(data[3]));
            localStorage.setItem("chart06month", JSON.stringify(data[4]));
        },
        complete: function () {
            if (isRepeated) {
                        //setTimeout(callout(true), 5000);
            }
        }
    });
}

