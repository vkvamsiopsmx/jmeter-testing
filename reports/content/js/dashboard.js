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
    cell.colSpan = 6;
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
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8552631578947368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 365.02941176470586, 28, 3152, 1591.0, 2378.0, 3152.0, 0.8798488730171052, 1.1608920519240225, 0.43269681766426], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 3152.0, 3152, 3152, 3152.0, 3152.0, 3152.0, 0.3172588832487309, 0.30269719622461927, 0.14778563213832488], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 20.257411858974358, 12.570112179487179], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 13.888888888888888, 13.780381944444445, 6.266276041666667], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 10.526315789473683, 8.15172697368421, 5.016447368421052], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 8.196721311475411, 7.500320184426229, 3.90625], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 5.714285714285714, 4.425223214285714, 2.7120535714285716], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 5.291005291005291, 4.097428902116402, 2.5318287037037037], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 8.474576271186441, 8.656647245762713, 3.9724576271186445], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 13.157894736842104, 10.25390625, 6.116365131578948], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 20.24872448979592, 9.207589285714285], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 9.523809523809526, 15.4296875, 4.501488095238096], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 4.761904761904763, 6.34765625, 2.250744047619048], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 9.345794392523365, 7.785119742990655, 5.476051401869159], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 5.4945054945054945, 4.673549107142858, 2.5111607142857144], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 18.18181818181818, 20.40127840909091, 8.487215909090908], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 10.869565217391305, 9.245499320652174, 4.96773097826087], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 6.756756756756757, 4.915804476351352, 3.662109375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 7.352941176470588, 8.25051700367647, 3.432329963235294], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 4902.0, 4902, 4902, 4902.0, 4902.0, 4902.0, 0.2039983680130559, 3.9138202519379846, 1.279970228988168], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 2.923976608187134, 2.247235928362573, 1.6276041666666665], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 2120.0, 2120, 2120, 2120.0, 2120.0, 2120.0, 0.4716981132075472, 0.7167600235849056, 0.23078198702830188], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1826.0, 1826, 1826, 1826.0, 1826.0, 1826.0, 0.547645125958379, 0.8348379312705366, 0.26793965635268346], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 4.048582995951417, 2.945502277327935, 2.194300354251012], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 17.241379310344826, 13.621363146551724, 8.452316810344827], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 8.849557522123893, 8.037195796460177, 4.148230088495575], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 6.7114093959731544, 5.623427013422819, 4.522336409395973], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 13.612085459183673, 10.861766581632653], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 13.333333333333334, 21.6015625, 6.302083333333334], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 1356.0, 1356, 1356, 1356.0, 1356.0, 1356.0, 0.7374631268436578, 0.7036147216076696, 0.34352530420353977], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 8.928571428571429, 59.884207589285715, 4.298618861607142], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 2.008032128514056, 1.5334776606425702, 1.1079474146586346], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 10.204081632653061, 10.423309948979592, 4.783163265306122], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 16.129032258064516, 21.578881048387096, 7.623487903225807], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 6794.0, 6794, 6794, 6794.0, 6794.0, 6794.0, 0.14718869590815425, 3.052584311524875, 1.0648182219605535], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 27.83203125, 16.6015625], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 6.41025641025641, 42.99379006410256, 3.0861879006410255], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 4.545454545454545, 7.914595170454546, 4.794034090909091], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 2.0202020202020203, 6.453203914141414, 4.358033459595959], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
