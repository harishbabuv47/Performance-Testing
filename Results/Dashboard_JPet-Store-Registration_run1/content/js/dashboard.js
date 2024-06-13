/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.9798630688683, "KoPercent": 0.02013693113169553};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.999359220812508, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9993006993006993, 500, 1500, "TA01-Launch-Page"], "isController": true}, {"data": [1.0, 500, 1500, "TA04-2-Click-on-Save"], "isController": false}, {"data": [1.0, 500, 1500, "TA02-Click-on-Sigin"], "isController": true}, {"data": [1.0, 500, 1500, "TA03-1-Click-on-Register-Now"], "isController": false}, {"data": [0.9992977528089888, 500, 1500, "TA01-1-Launch-Page"], "isController": false}, {"data": [0.995774647887324, 500, 1500, "TA04-Click-on-Save"], "isController": true}, {"data": [0.9985855728429985, 500, 1500, "TA04-1-Click-on-Save"], "isController": false}, {"data": [1.0, 500, 1500, "TA04-1-Click-on-Save-0"], "isController": false}, {"data": [1.0, 500, 1500, "TA03-Click-on-Register-Now"], "isController": true}, {"data": [1.0, 500, 1500, "TA04-1-Click-on-Save-1"], "isController": false}, {"data": [1.0, 500, 1500, "TA02-1-Click-on-Sigin"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4966, 1, 0.02013693113169553, 43.874546919049614, 0, 5068, 33.0, 67.0, 93.0, 122.0, 2.7673970975209334, 4.955950771009315, 3.33073114177839], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TA01-Launch-Page", 715, 0, 0.0, 39.85174825174832, 0, 662, 33.0, 37.0, 93.19999999999993, 107.68000000000006, 0.39732486447887927, 0.7550051558458157, 0.3065017056489593], "isController": true}, {"data": ["TA04-2-Click-on-Save", 705, 0, 0.0, 38.180141843971676, 28, 104, 33.0, 37.0, 92.0, 101.93999999999994, 0.3974883248376077, 0.7577914054566972, 0.33305174092838613], "isController": false}, {"data": ["TA02-Click-on-Sigin", 712, 0, 0.0, 38.28792134831458, 0, 104, 33.0, 37.0, 94.0, 100.0, 0.3971321702715335, 0.7583235871758102, 0.32021657229199924], "isController": true}, {"data": ["TA03-1-Click-on-Register-Now", 710, 0, 0.0, 38.91549295774647, 29, 109, 34.0, 38.0, 95.0, 103.88999999999999, 0.3981248878521443, 1.0106460294752602, 0.32814199740938454], "isController": false}, {"data": ["TA01-1-Launch-Page", 712, 0, 0.0, 40.01966292134838, 29, 662, 33.0, 37.0, 93.35000000000002, 107.74000000000001, 0.39698492182129097, 0.7575376693110025, 0.30752980418662973], "isController": false}, {"data": ["TA04-Click-on-Save", 710, 1, 0.14084507042253522, 120.7422535211268, 0, 5068, 98.0, 156.0, 163.0, 175.0, 0.39813270155468017, 1.6058267211529025, 1.3607213482890106], "isController": true}, {"data": ["TA04-1-Click-on-Save", 707, 1, 0.14144271570014144, 69.03677510608199, 56, 142, 64.0, 72.0, 124.0, 137.0, 0.39771630957517484, 0.8548729600162912, 1.032766034134129], "isController": false}, {"data": ["TA04-1-Click-on-Save-0", 706, 0, 0.0, 38.332861189801676, 29, 107, 33.0, 37.0, 94.64999999999998, 103.92999999999995, 0.39716091824054334, 0.08920606562043455, 0.664934036339099], "isController": false}, {"data": ["TA03-Click-on-Register-Now", 710, 0, 0.0, 38.91549295774647, 29, 109, 34.0, 38.0, 95.0, 103.88999999999999, 0.3981248878521443, 1.0106460294752602, 0.32814199740938454], "isController": true}, {"data": ["TA04-1-Click-on-Save-1", 706, 0, 0.0, 30.562322946175655, 27, 37, 30.0, 33.0, 34.0, 35.0, 0.39716181193544375, 0.7572902230758326, 0.36690925204192365], "isController": false}, {"data": ["TA02-1-Click-on-Sigin", 710, 0, 0.0, 38.3957746478873, 29, 104, 33.0, 37.0, 94.0, 100.0, 0.39812153921637344, 0.7623542309175019, 0.32191858835073944], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 0.02013693113169553], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4966, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TA04-1-Click-on-Save", 707, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
