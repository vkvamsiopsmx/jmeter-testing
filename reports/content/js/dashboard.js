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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9895833333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.5, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelinescount-52-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelinescount-52-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48-1"], "isController": false}, {"data": [0.5, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71-1"], "isController": false}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelinescount-69-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelinescount-69-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 0, 0.0, 50.456521739130395, 6, 346, 101.10000000000001, 204.74999999999997, 346.0, 8.40643274853801, 11.54617398802997, 5.216185809576023], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 10.101010101010102, 21.375868055555554, 9.223090277777777], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-1", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 35.73217147435897, 12.26963141025641], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 11.192908653846153, 6.941105769230769], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-0", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 24.919181034482758, 18.689385775862068], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 70.54036458333334, 31.022135416666668], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-0", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 32.84801136363637, 24.636008522727273], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 57.19489020270271, 25.047508445945947], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-1", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 73.34498355263158, 23.54029605263158], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-1", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 35.73217147435897, 11.46834935897436], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-0", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 24.919181034482758, 23.235452586206897], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-0", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 17.857142857142858, 12.904575892857142, 8.754185267857142], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-1", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 116.12955729166666, 40.283203125], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 46.004585597826086, 19.828464673913043], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 37.126507675438596, 16.138980263157894], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 24.876644736842106], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-1", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 73.34498355263158, 23.54029605263158], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 25.809151785714285, 16.95033482142857], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 25.801809210526315], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 68.2648689516129, 29.170866935483872], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 50.23871527777778], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-1", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 35.73217147435897, 11.46834935897436], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-0", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 18.06640625, 11.71875], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 60.46316964285714, 26.116071428571427], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 1471.0, 1471, 1471, 1471.0, 1471.0, 1471.0, 0.6798096532970768, 16.845869094153635, 7.6312616842284156], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 4.807692307692308, 3.746619591346154, 2.6761568509615388], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 32.53728693181819, 21.306818181818183], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 49.52566964285714, 16.11328125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.06534090909092, 40.39417613636364], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 24.683459051724135, 20.204741379310345], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 4.926108374384237, 10.424684421182265, 4.613415948275862], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 12.345679012345679, 26.126060956790123, 12.598861882716049], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 13.157894736842104, 27.84488075657895, 12.335526315789474], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-0", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 42.50919117647059, 27.45863970588235], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 51.61490091463414, 28.225038109756095], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 19.056919642857142, 15.206473214285714], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 17.241379310344826, 36.48639547413793, 15.86072198275862], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-1", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 8.695652173913043, 12.117866847826086, 3.8892663043478257], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-0", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 4.385964912280701, 3.1695449561403506, 2.0430715460526314], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-1", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 81.97380514705881, 26.309742647058822], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-0", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 32.84801136363637, 21.75071022727273], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-1", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 116.12955729166666, 37.841796875], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 4.329004329004329, 3.352441829004329, 2.3885619588744587], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 11.235955056179774, 23.777650983146067, 10.292310393258427], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-0", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 8.064516129032258, 5.827872983870968, 3.9456275201612905], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-0", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 42.50919117647059, 28.033088235294116], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-0", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 17.857142857142858, 12.904575892857142, 8.335658482142858], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 37.126507675438596, 16.138980263157894], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-1", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 12.82051282051282, 17.866085737179485, 5.73417467948718], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 1.1074197120708749, 32.13463801218162, 14.500276854928018], "isController": true}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 70.54036458333334, 30.403645833333336], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 43.18797831632653, 18.95328443877551], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 11.11111111111111, 46.72309027777778, 21.668836805555557], "isController": true}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-1", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 16.949152542372882, 23.619570974576273, 8.110434322033898], "isController": false}, {"data": ["\/oes\/policy\/list-71-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 45.703125], "isController": false}, {"data": ["\/oes\/policy\/list-71-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}, {"data": ["DataSouce create and save", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 6.7114093959731544, 47.084731543624166, 23.791421979865774], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-1", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 77.41970486111111, 25.11935763888889], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-0", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 21.898674242424242, 14.825994318181818], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-0", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 42.50919117647059, 28.033088235294116], "isController": false}, {"data": ["\/oes\/policy\/list-54-0", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 21.898674242424242, 13.849431818181818], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 46.45182291666667, 14.908854166666668], "isController": false}, {"data": ["\/oes\/policy\/list-54-1", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 232.25911458333331, 74.54427083333333], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-1", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 63.34339488636364, 20.640980113636363], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 55.6897615131579, 24.67105263157895], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 58.783637152777786, 25.797526041666668], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 22.22222222222222, 47.02690972222222, 20.72482638888889], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 29.41176470588235, 62.2414981617647, 26.941636029411764], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 36.376953125, 22.55859375], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 37.126507675438596, 16.138980263157894], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 36.88665021929825, 18.194901315789473], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 13.157894736842104, 27.84488075657895, 12.027138157894736], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 52.9052734375, 22.607421875], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-0", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 20.073784722222225, 12.91232638888889], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 14.492753623188406, 30.669723731884055, 14.789968297101447], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 40.66051136363637], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 24.46546052631579], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 15.873015873015872, 33.590649801587304, 14.86545138888889], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-0", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 32.84801136363637, 21.484375], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-1", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 39.81584821428571, 12.779017857142856], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-1", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 49.76981026785714, 15.973772321428571], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 25.809151785714285, 16.880580357142858], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 63.71330492424242, 27.669270833333332], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-0", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 41.666666666666664, 30.110677083333332, 19.53125], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 2.890173410404624, 6.116216582369943, 2.638976697976879], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-0", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 40.14756944444445, 26.746961805555557], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 7.092198581560283, 15.008588209219859, 6.586602393617022], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 46.45182291666667, 14.908854166666668], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 19.017269736842106, 12.669613486842106], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-1", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 9.803921568627452, 13.662300857843139, 4.384957107843138], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-1", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 81.97380514705881, 26.309742647058822], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-0", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 18.06640625, 11.81640625], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 19.017269736842106, 12.25842927631579], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-1", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 16.393442622950822, 22.84515881147541, 7.332223360655738], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 92, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
