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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999260901699926, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "TB09-1-Logout"], "isController": false}, {"data": [1.0, 500, 1500, "TB04-Select-Product"], "isController": true}, {"data": [1.0, 500, 1500, "TB02-2-Click-on-Login"], "isController": false}, {"data": [1.0, 500, 1500, "TB06-Click-on-Checkout"], "isController": true}, {"data": [1.0, 500, 1500, "TB09-Logout"], "isController": true}, {"data": [1.0, 500, 1500, "TB09-1-Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "TB08-1-Click-on-Confirm"], "isController": false}, {"data": [1.0, 500, 1500, "TB05-Add-to-Cart"], "isController": true}, {"data": [1.0, 500, 1500, "TB02-1-Click-on-Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "TB02-1-Click-on-Login"], "isController": false}, {"data": [1.0, 500, 1500, "TB02-1-Click-on-Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "TB05-1-Add-to-Cart"], "isController": false}, {"data": [1.0, 500, 1500, "TB03-1-Click-on-Fish"], "isController": false}, {"data": [1.0, 500, 1500, "TB04-1-Select-Product"], "isController": false}, {"data": [1.0, 500, 1500, "TB06-1-Click-on-Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "TB09-1-Logout-1"], "isController": false}, {"data": [0.9991568296795953, 500, 1500, "TB01-Click-on-Sigin"], "isController": true}, {"data": [1.0, 500, 1500, "TB02-Click-on-Login"], "isController": true}, {"data": [1.0, 500, 1500, "TB07-1-Click-on-Contiue"], "isController": false}, {"data": [1.0, 500, 1500, "TB08-Click-on-Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "TB03-Click-on-Fish"], "isController": true}, {"data": [1.0, 500, 1500, "TB07-Click-on-Contiue"], "isController": true}, {"data": [0.9991539763113367, 500, 1500, "TB01-1-Click-on-Sigin"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8238, 0, 0.0, 37.87581937363438, 0, 658, 32.0, 61.0, 66.0, 99.0, 4.585733681206341, 8.090506821021398, 4.85101134079132], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TB09-1-Logout", 583, 0, 0.0, 60.80102915951973, 54, 71, 60.0, 65.0, 66.0, 68.15999999999997, 0.32973546505709006, 0.7271686823137362, 0.5432262983899521], "isController": false}, {"data": ["TB04-Select-Product", 590, 0, 0.0, 31.410169491525437, 27, 38, 31.0, 34.0, 34.0, 36.0, 0.3311804731502448, 0.5884324265186308, 0.28396138225187], "isController": true}, {"data": ["TB02-2-Click-on-Login", 590, 0, 0.0, 30.962711864406796, 27, 37, 31.0, 33.0, 34.0, 35.0, 0.3311797295552649, 0.6513089887581321, 0.2761987197658166], "isController": false}, {"data": ["TB06-Click-on-Checkout", 589, 0, 0.0, 31.224108658743614, 0, 37, 31.0, 34.0, 34.0, 35.0, 0.33088530638912, 0.7665245900378804, 0.27742015355550026], "isController": true}, {"data": ["TB09-Logout", 585, 0, 0.0, 60.5931623931624, 0, 71, 60.0, 65.0, 66.0, 68.13999999999999, 0.33023122960045975, 0.725772211860551, 0.5421830748662422], "isController": true}, {"data": ["TB09-1-Logout-0", 583, 0, 0.0, 30.070325900514597, 26, 35, 30.0, 32.0, 33.0, 34.0, 0.32974087344567904, 0.07406289149658805, 0.27306666082220293], "isController": false}, {"data": ["TB08-1-Click-on-Confirm", 585, 0, 0.0, 32.65128205128205, 29, 38, 33.0, 35.0, 36.0, 37.0, 0.3302254508424136, 0.7185611876007963, 0.2699206077686525], "isController": false}, {"data": ["TB05-Add-to-Cart", 590, 0, 0.0, 31.869491525423747, 0, 38, 32.0, 34.0, 35.0, 36.09000000000003, 0.3311862361245597, 0.7019014703405886, 0.28413077646332396], "isController": true}, {"data": ["TB02-1-Click-on-Login-1", 590, 0, 0.0, 30.74915254237287, 27, 36, 31.0, 33.0, 34.0, 35.0, 0.3311797295552649, 0.6515227733425577, 0.3046594777744722], "isController": false}, {"data": ["TB02-1-Click-on-Login", 590, 0, 0.0, 61.47966101694919, 55, 70, 61.0, 66.0, 67.0, 69.0, 0.33117359502408866, 0.7258953992059132, 0.6962473155292912], "isController": false}, {"data": ["TB02-1-Click-on-Login-0", 590, 0, 0.0, 30.630508474576285, 27, 35, 30.5, 33.0, 34.0, 34.0, 0.33117898596362416, 0.0743859050504234, 0.3915998555161509], "isController": false}, {"data": ["TB05-1-Add-to-Cart", 589, 0, 0.0, 31.923599320882868, 28, 38, 32.0, 34.0, 35.0, 36.10000000000002, 0.33087954411652354, 0.7024420606183683, 0.2843496082251374], "isController": false}, {"data": ["TB03-1-Click-on-Fish", 590, 0, 0.0, 31.01186440677965, 27, 37, 31.0, 33.0, 34.0, 35.0, 0.3311804731502448, 0.5613540813572898, 0.2736119924659249], "isController": false}, {"data": ["TB04-1-Select-Product", 590, 0, 0.0, 31.410169491525437, 27, 38, 31.0, 34.0, 34.0, 36.0, 0.3311808449489869, 0.5884330871204893, 0.28396170104024465], "isController": false}, {"data": ["TB06-1-Click-on-Checkout", 588, 0, 0.0, 31.27721088435372, 27, 37, 31.0, 34.0, 34.0, 35.0, 0.33078549741869173, 0.7675965939008892, 0.2778081325977294], "isController": false}, {"data": ["TB09-1-Logout-1", 583, 0, 0.0, 30.63464837049744, 27, 37, 30.0, 33.0, 34.0, 35.0, 0.32974068694656733, 0.6531173485879407, 0.2701683948712597], "isController": false}, {"data": ["TB01-Click-on-Sigin", 593, 0, 0.0, 65.46374367622255, 0, 658, 86.0, 100.60000000000002, 103.0, 111.17999999999984, 0.32960814982552444, 0.6271751037390237, 0.2653325196653227], "isController": true}, {"data": ["TB02-Click-on-Login", 591, 0, 0.0, 92.28595600676812, 0, 105, 92.0, 99.0, 101.0, 104.0, 0.32915952373791546, 1.3665006631923906, 0.9648914957097872], "isController": true}, {"data": ["TB07-1-Click-on-Contiue", 586, 0, 0.0, 31.54266211604094, 27, 73, 31.0, 34.0, 34.64999999999998, 36.0, 0.3303843057306455, 0.6491810673019893, 0.4915880441756517], "isController": false}, {"data": ["TB08-Click-on-Confirm", 586, 0, 0.0, 32.59556313993174, 0, 38, 33.0, 35.0, 36.0, 37.0, 0.330390080178794, 0.717692591411211, 0.2695943279535943], "isController": true}, {"data": ["TB03-Click-on-Fish", 590, 0, 0.0, 31.01186440677965, 27, 37, 31.0, 33.0, 34.0, 35.0, 0.3311799154536968, 0.5613531360562871, 0.2736115317127222], "isController": true}, {"data": ["TB07-Click-on-Contiue", 588, 0, 0.0, 31.435374149659847, 0, 73, 31.0, 34.0, 34.549999999999955, 36.0, 0.33079126621045973, 0.6477698962086145, 0.4905194442537956], "isController": true}, {"data": ["TB01-1-Click-on-Sigin", 591, 0, 0.0, 65.68527918781722, 27, 658, 86.0, 100.80000000000007, 103.0, 111.24000000000012, 0.32903820629080965, 0.6282093708452663, 0.2657700764109114], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8238, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
