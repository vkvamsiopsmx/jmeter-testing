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

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 32, 100.0, 6859.187499999999, 0, 199770, 1062.8999999999999, 70689.09999999958, 199770.0, 0.11628371773581066, 0.2982893120727936, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 2.5473449827416172, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2583.0078125, 0.0], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2583.0078125, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 0.9765625, 2.5224685668945312, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, 100.0, 1074.0, 1074, 1074, 1074.0, 1074.0, 1074.0, 0.931098696461825, 2.4050352071694596, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, 100.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 2.490846492285439, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, 100.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 95.66695601851852, 0.0], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 2.527404904598826, 0.0], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 199840.0, 199840, 199840, 199840.0, 199840.0, 199840.0, 0.0050040032025620495, 0.16517608618144516, 0.0], "isController": true}, {"data": ["\/login-59", 1, 1, 100.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 2.1815944362331083, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2583.0078125, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 2.524934323069404, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2583.0078125, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, 100.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 2.527404904598826, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 2.527404904598826, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, 100.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 2.527404904598826, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2583.0078125, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 38.46153846153847, 99.34645432692308, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1000.0, 2583.0078125, 0.0], "isController": false}, {"data": ["\/login-42", 1, 1, 100.0, 199770.0, 199770, 199770, 199770.0, 199770.0, 199770.0, 0.00500575662011313, 0.01007506288481754, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 234.81889204545456, 0.0], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 15512.0, 15512, 15512, 15512.0, 15512.0, 15512.0, 0.06446621970087674, 2.4977512369455903, 0.0], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 1022.0, 1022, 1022, 1022.0, 1022.0, 1022.0, 0.9784735812133072, 2.527404904598826, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 1027.0, 1027, 1027, 1027.0, 1027.0, 1027.0, 0.9737098344693281, 2.5151001095423564, 0.0], "isController": false}, {"data": ["DataSouce create and save", 1, 1, 100.0, 4142.0, 4142, 4142, 4142.0, 4142.0, 4142.0, 0.24142926122646063, 2.4944546716562046, 0.0], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: 40.64.111.180:8084 failed to respond", 1, 3.125, 3.125], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 31, 96.875, 96.875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 32, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 31, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: 40.64.111.180:8084 failed to respond", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-59", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/login-42", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: 40.64.111.180:8084 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Connection refused (Connection refused)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
