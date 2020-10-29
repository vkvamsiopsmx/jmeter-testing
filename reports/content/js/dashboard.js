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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 0, 0.0, 22.96739130434782, 6, 169, 48.10000000000001, 60.04999999999998, 169.0, 11.427151906595453, 15.69510969134269, 7.090539995031673], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 117.56727430555557, 50.72699652777778], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 53.16840277777778], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 31.25, 22.735595703125, 14.09912109375], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 60.22135416666667], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 72.97279094827586, 32.09186422413793], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 25.809151785714285, 19.356863839285715], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 16.129032258064516, 34.13243447580645, 14.947706653225806], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-1", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 174.1943359375, 55.908203125], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 74.86979166666667], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 49.0234375], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 48.33984375], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 75.57896205357143, 32.57533482142857], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 43.18797831632653, 18.77391581632653], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 52.517361111111114], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-1", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 199.07924107142856, 63.895089285714285], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-0", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 36.1328125, 23.73046875], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-0", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 51.61830357142857, 35.01674107142857], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 47.594572368421055], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-1", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 23.809523809523807, 33.17987351190476, 10.765438988095237], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-1", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 73.34498355263158, 23.54029605263158], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-0", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 20.073784722222225, 13.020833333333334], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 48.108552631578945], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 1.7889087656529516, 44.32964836762075, 20.081549083184257], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 6.369426751592357, 4.963674363057325, 3.5454816878980893], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 44.73876953125, 29.296875], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 138.671875, 45.1171875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 115.55989583333333, 37.027994791666664], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 37.674753289473685, 30.838815789473685], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 100.7719494047619, 44.596354166666664], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 23.809523809523807, 50.38597470238095, 24.297805059523807], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 100.7719494047619, 44.64285714285714], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 51.86631944444445], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 60.90666118421053], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 74.11024305555556, 59.13628472222223], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 117.56727430555557, 51.106770833333336], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 24.51685855263158], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 25.185032894736842], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 50.45572916666667], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 5.9171597633136095, 4.582331730769231, 3.2648391272189348], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 17.857142857142858, 37.789481026785715, 16.357421875], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-0", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 65.69602272727273, 44.47798295454546], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 25.082236842105264], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-0", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 20.073784722222225, 12.966579861111112], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 151.15792410714286, 65.70870535714286], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 1.8832391713747645, 54.647039783427495, 24.65866290018832], "isController": true}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 48.00575657894737], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 105.810546875, 46.435546875], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 73.7733004385965, 34.21395285087719], "isController": true}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-1", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 99.53962053571428, 34.1796875], "isController": false}, {"data": ["\/oes\/policy\/list-71-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 45.703125], "isController": false}, {"data": ["\/oes\/policy\/list-71-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["DataSouce create and save", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 9.174311926605505, 64.36353211009174, 32.52221903669725], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 45.21484375], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-0", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 65.69602272727273, 44.47798295454546], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 52.95138888888889], "isController": false}, {"data": ["\/oes\/policy\/list-54-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 45.703125], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-1", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 77.41970486111111, 24.84809027777778], "isController": false}, {"data": ["\/oes\/policy\/list-54-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 45.41015625], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 100.7719494047619, 44.64285714285714], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 48.87952302631579], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 70.54036458333334, 31.087239583333336], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 48.21134868421053], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 41.666666666666664, 30.314127604166664, 18.798828125], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 16.949152542372882, 35.867981991525426, 15.591896186440678], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 72.50134698275862, 35.76239224137931], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 46.004585597826086, 19.87092391304348], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-1", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 232.25911458333331, 74.54427083333333], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 47.594572368421055], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-0", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 34.41220238095238, 22.135416666666664], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 53.7109375], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 46.484375], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 72.97279094827586, 32.29391163793103], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-0", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 14.748086734693876, 9.646045918367346], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-0", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 18.529647435897434, 12.119391025641026], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 75.09068080357143, 32.61021205357143], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 52.083333333333336], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 72.97279094827586, 31.48572198275862], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 53.493923611111114], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 15.625, 33.0657958984375, 14.5111083984375], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 40.66051136363637], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 53.493923611111114], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-1", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 18.18181818181818, 25.337357954545453, 8.132102272727273], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-1", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 199.07924107142856, 63.895089285714285], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 120.44270833333333, 78.77604166666667], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-0", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 90.33203125, 58.2275390625], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}]}, function(index, item){
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
