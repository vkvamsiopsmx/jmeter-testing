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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [0.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 34, 100.0, 20.441176470588243, 1, 265, 8.0, 17.5, 196.75, 265.0, 3.0799891294501314, 1.1605692035057524, 1.3273252785578404], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 37.6953125, 40.13671875], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 31.412760416666664, 35.481770833333336], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 19.839638157894736, 20.353618421052634], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 41.88368055555556, 45.78993055555556], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 188.4765625, 206.0546875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 62.82552083333333, 67.3828125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 62.82552083333333, 68.359375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 75.390625, 82.8125], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 62.82552083333333, 67.3828125], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 31.412760416666664, 33.365885416666664], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 188.4765625, 193.359375], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 188.4765625, 204.1015625], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 37.6953125, 40.8203125], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 125.65104166666666, 130.859375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 37.6953125, 40.234375], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 41.88368055555556, 43.61979166666667], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 47.119140625, 59.6923828125], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 376.953125, 402.34375], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 12.23876953125, 13.75244140625], "isController": true}, {"data": ["\/login-59", 1, 1, 100.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 2.1663972701149428, 3.1990840517241383], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 23.5595703125, 26.55029296875], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 23.5595703125, 26.55029296875], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 47.119140625, 59.6923828125], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 41.88368055555556, 47.30902777777778], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 47.119140625, 75.439453125], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 47.119140625, 58.4716796875], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 23.5595703125, 25.5126953125], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 41.88368055555556, 44.59635416666667], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 37.6953125, 41.69921875], "isController": false}, {"data": ["\/login-42", 1, 1, 100.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.4040389150943395, 2.0821049528301887], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 47.119140625, 50.537109375], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 62.82552083333333, 68.03385416666667], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 21.499227661596958, 24.0761644486692], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 376.953125, 400.390625], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 53.85044642857143, 59.5703125], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 188.4765625, 260.7421875], "isController": false}, {"data": ["DataSource-Delete", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 94.23828125, 115.72265625], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 62.82552083333333, 78.89811197916667], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Temporarily Unavailable", 34, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 34, "503\/Service Temporarily Unavailable", 34, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-59", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/login-42", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, "503\/Service Temporarily Unavailable", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
