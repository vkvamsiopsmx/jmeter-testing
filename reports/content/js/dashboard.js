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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 32, 100.0, 131046.99999999997, 130324, 131213, 131075.0, 131135.65, 131213.0, 0.007612171290981432, 0.019706900480851344, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, 100.0, 131075.0, 131075, 131075, 131075.0, 131075.0, 131075.0, 0.007629219912263971, 0.019751037097081824, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 131050.0, 131050, 131050, 131050.0, 131050.0, 131050.0, 0.007630675314765358, 0.019754804940862264, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 131069.0, 131069, 131069, 131069.0, 131069.0, 131069.0, 0.007629569158229634, 0.0197519412485027, 0.0], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, 100.0, 130963.0, 130963, 130963, 130963.0, 130963.0, 130963.0, 0.0076357444469048515, 0.019767928250727304, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, 100.0, 131069.0, 131069, 131069, 131069.0, 131069.0, 131069.0, 0.007629569158229634, 0.0197519412485027, 0.0], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, 100.0, 131044.0, 131044, 131044, 131044.0, 131044.0, 131044.0, 0.0076310246939959095, 0.019755709437288237, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 1703161.0, 1703161, 1703161, 1703161.0, 1703161.0, 1703161.0, 5.871435524885786E-4, 0.019760476806068246, 0.0], "isController": true}, {"data": ["\/login-59", 1, 1, 100.0, 131213.0, 131213, 131213, 131213.0, 131213.0, 131213.0, 0.007621196070511306, 0.019730264436450658, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 131072.0, 131072, 131072, 131072.0, 131072.0, 131072.0, 0.00762939453125, 0.01975148916244507, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 131074.0, 131074, 131074, 131074.0, 131074.0, 131074.0, 0.007629278117704503, 0.019751187783236947, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, 100.0, 131075.0, 131075, 131075, 131075.0, 131075.0, 131075.0, 0.007629219912263971, 0.019751037097081824, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 131056.0, 131056, 131056, 131056.0, 131056.0, 131056.0, 0.007630325967525333, 0.019753900527255522, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 131075.0, 131075, 131075, 131075.0, 131075.0, 131075.0, 0.007629219912263971, 0.019751037097081824, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 131063.0, 131063, 131063, 131063.0, 131063.0, 131063.0, 0.0076299184361719175, 0.019752845482706793, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, 100.0, 131094.0, 131094, 131094, 131094.0, 131094.0, 131094.0, 0.00762811417761301, 0.019748174496925872, 0.0], "isController": false}, {"data": ["\/login-42", 1, 1, 100.0, 130324.0, 130324, 130324, 130324.0, 130324.0, 130324.0, 0.007673183757404622, 0.019864853653202785, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, 100.0, 131067.0, 131067, 131067, 131067.0, 131067.0, 131067.0, 0.007629685580657221, 0.019752242650705364, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.019751790550850693, 0.0], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 1966076.0, 1966076, 1966076, 1966076.0, 1966076.0, 1966076.0, 5.086273368882994E-4, 0.019751529347034398, 0.0], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 131064.0, 131064, 131064, 131064.0, 131064.0, 131064.0, 0.007629860220960752, 0.019752694771256792, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 131071.0, 131071, 131071, 131071.0, 131071.0, 131071.0, 0.007629452739355006, 0.019751639855498167, 0.0], "isController": false}, {"data": ["DataSouce create and save", 1, 1, 100.0, 524267.0, 524267, 524267, 524267.0, 524267.0, 524267.0, 0.0019074250334276234, 0.01975228032662746, 0.0], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 32, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 32, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 32, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-59", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/login-42", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 40.64.111.180:8084 [\\\/40.64.111.180] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
