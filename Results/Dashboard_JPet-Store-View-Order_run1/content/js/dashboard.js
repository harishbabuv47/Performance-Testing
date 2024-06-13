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

    var data = {"OkPercent": 98.34474885844749, "KoPercent": 1.6552511415525115};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.978919346715591, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "TC04-Click-on-My-Accouint"], "isController": true}, {"data": [0.9993243243243243, 500, 1500, "TC01-Launch-Page"], "isController": true}, {"data": [0.8019125683060109, 500, 1500, "TC06-View-Order"], "isController": true}, {"data": [1.0, 500, 1500, "TC03-2-Click-on-Login"], "isController": false}, {"data": [1.0, 500, 1500, "TC07-1-Logout"], "isController": false}, {"data": [0.9993243243243243, 500, 1500, "TC01-1-Launch-Page"], "isController": false}, {"data": [1.0, 500, 1500, "TC05-Click-on-My-Orders"], "isController": true}, {"data": [1.0, 500, 1500, "TC02-1-Click-on-Sigin"], "isController": true}, {"data": [1.0, 500, 1500, "TC03-1-Click-on-Login"], "isController": false}, {"data": [1.0, 500, 1500, "TC03-1-Click-on-Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "TC03-1-Click-on-Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "TC07-Logout"], "isController": true}, {"data": [1.0, 500, 1500, "TC07-1-Logout-1"], "isController": false}, {"data": [0.997289972899729, 500, 1500, "TC03-Click-on-Login"], "isController": true}, {"data": [1.0, 500, 1500, "TC07-1-Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "TC05-1-Click-on-My-Orders"], "isController": false}, {"data": [1.0, 500, 1500, "TC04-1-Click-on-My-Accouint"], "isController": false}, {"data": [0.8013698630136986, 500, 1500, "TC06-1-View-Order"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8760, 145, 1.6552511415525115, 39.9302511415525, 0, 3033, 32.0, 61.0, 65.0, 98.0, 4.876593243134915, 8.415628743731684, 5.004049410334425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["TC04-Click-on-My-Accouint", 735, 0, 0.0, 44.47891156462588, 0, 124, 32.0, 95.0, 100.0, 105.63999999999999, 0.41165908131134976, 1.0641620254088866, 0.33441940212259263], "isController": true}, {"data": ["TC01-Launch-Page", 740, 0, 0.0, 45.294594594594614, 27, 684, 31.0, 94.0, 98.0, 108.59000000000003, 0.4119329172810869, 0.7859576339171647, 0.31027068272036046], "isController": true}, {"data": ["TC06-View-Order", 732, 145, 19.808743169398905, 31.74999999999997, 0, 37, 32.0, 34.0, 35.0, 36.0, 0.4112867882547281, 0.7754672671973503, 0.34062375774674397], "isController": true}, {"data": ["TC03-2-Click-on-Login", 735, 0, 0.0, 30.699319727891137, 27, 36, 31.0, 33.0, 34.0, 35.0, 0.4116510117933814, 0.8087648315129211, 0.3433105117886209], "isController": false}, {"data": ["TC07-1-Logout", 730, 0, 0.0, 60.58904109589043, 54, 71, 60.0, 65.0, 66.0, 69.0, 0.4121206373078699, 0.9088260142048951, 0.6789526515023209], "isController": false}, {"data": ["TC01-1-Launch-Page", 740, 0, 0.0, 45.294594594594614, 27, 684, 31.0, 94.0, 98.0, 108.59000000000003, 0.4119496575250955, 0.7859895738812227, 0.3102832915863179], "isController": false}, {"data": ["TC05-Click-on-My-Orders", 734, 0, 0.0, 45.53405994550409, 0, 53, 46.0, 49.0, 50.0, 52.0, 0.41157939949780586, 0.6683056202386599, 0.33790628395950595], "isController": true}, {"data": ["TC02-1-Click-on-Sigin", 1478, 0, 0.0, 30.70365358592692, 0, 37, 31.0, 33.0, 34.0, 35.0, 0.8231011868695869, 1.5669721842755373, 0.6646538603334284], "isController": true}, {"data": ["TC03-1-Click-on-Login", 737, 0, 0.0, 59.85888738127544, 29, 72, 61.0, 66.0, 67.0, 69.0, 0.41183468720959926, 0.8989134830387812, 0.8504191366154006], "isController": false}, {"data": ["TC03-1-Click-on-Login-0", 707, 0, 0.0, 30.41867043847241, 27, 36, 30.0, 33.0, 33.0, 35.0, 0.4118618544269324, 0.09250803370917426, 0.4870146050393366], "isController": false}, {"data": ["TC03-1-Click-on-Login-1", 707, 0, 0.0, 30.54455445544553, 27, 38, 30.0, 33.0, 34.0, 35.0, 0.41186401380414384, 0.8106063931183757, 0.37888271582373384], "isController": false}, {"data": ["TC07-Logout", 730, 0, 0.0, 60.58904109589043, 54, 71, 60.0, 65.0, 66.0, 69.0, 0.4121197066610965, 0.9088239619029205, 0.678951118298115], "isController": true}, {"data": ["TC07-1-Logout-1", 730, 0, 0.0, 30.560273972602754, 27, 37, 30.0, 33.0, 33.0, 35.0, 0.41212831530413097, 0.8162750627295993, 0.33767153959000573], "isController": false}, {"data": ["TC03-Click-on-Login", 738, 0, 0.0, 98.48509485094846, 0, 3033, 91.0, 98.0, 101.0, 104.0, 0.4117028487270963, 1.7029866674244305, 1.1909529318835406], "isController": true}, {"data": ["TC07-1-Logout-0", 730, 0, 0.0, 29.92054794520546, 27, 35, 30.0, 32.0, 33.0, 34.0, 0.4121285479751503, 0.09256793558035604, 0.3412939537919214], "isController": false}, {"data": ["TC05-1-Click-on-My-Orders", 732, 0, 0.0, 45.658469945355186, 29, 53, 46.0, 49.0, 50.0, 52.0, 0.4112747720009529, 0.6696355988584878, 0.3385787429656282], "isController": false}, {"data": ["TC04-1-Click-on-My-Accouint", 734, 0, 0.0, 44.53950953678478, 28, 124, 32.0, 95.0, 100.0, 105.64999999999998, 0.4115713221139963, 1.0653846658632427, 0.3348036243368739], "isController": false}, {"data": ["TC06-1-View-Order", 730, 145, 19.863013698630137, 31.836986301369834, 27, 37, 32.0, 34.0, 35.0, 36.0, 0.4121271519529746, 0.7791806532906942, 0.3422548614420047], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 145, 100.0, 1.6552511415525115], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8760, 145, "500", 145, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TC06-1-View-Order", 730, 145, "500", 145, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
