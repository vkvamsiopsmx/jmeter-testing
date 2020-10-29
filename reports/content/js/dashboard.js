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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 0, 0.0, 51.48913043478262, 9, 284, 130.00000000000003, 167.09999999999997, 284.0, 8.011145942180425, 11.003250446273075, 4.970910614768373], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 55.6897615131579, 24.02857730263158], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-1", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 38.70985243055556, 13.292100694444445], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 3.5211267605633805, 2.561757262323944, 1.5886333626760565], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-0", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 48.177083333333336, 36.1328125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 14.285714285714285, 30.23158482142857, 13.295200892857142], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-0", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 32.84801136363637, 24.636008522727273], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 7.142857142857142, 15.115792410714285, 6.619698660714285], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 35.46463815789474], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-0", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 31.41983695652174, 21.31453804347826], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-1", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 20.0, 27.87109375, 9.66796875], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 43.18797831632653, 18.614477040816325], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 70.54036458333334, 30.6640625], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-0", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 12.678179824561402, 8.292214912280702], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-1", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 66.35974702380952, 21.298363095238095], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-0", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 10.0, 7.2265625, 4.74609375], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-0", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 20.647321428571427, 14.006696428571427], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 17.241379310344826, 36.48639547413793, 15.591325431034482], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-1", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 34.8388671875, 11.3037109375], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-1", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 41.666666666666664, 58.06477864583333, 18.636067708333332], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-0", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 19.53125, 12.66891891891892], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 17.857142857142858, 37.789481026785715, 16.322544642857142], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 1271.0, 1271, 1271, 1271.0, 1271.0, 1271.0, 0.7867820613690008, 19.496674616443748, 8.832089643981117], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 5.681818181818182, 4.427823153409091, 3.1627308238636367], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 8.130081300813009, 5.819677337398374, 3.8109756097560976], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 72.98519736842105, 23.745888157894736], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 92.44791666666667, 29.622395833333336], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 14.705882352941176, 10.526769301470587, 8.61672794117647], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 43.18797831632653, 19.112723214285715], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 11.627906976744185, 24.607103924418606, 11.866369912790699], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 22.727272727272727, 48.095703125, 21.306818181818183], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 19.017269736842106, 12.284128289473685], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 14.492753623188406, 30.669723731884055, 16.77139945652174], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 21.515877016129032, 17.16859879032258], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 15.151515151515152, 32.06380208333333, 13.938210227272727], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-1", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 10.638297872340425, 14.825049867021276, 4.75814494680851], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-0", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 12.987012987012989, 9.385146103896105, 6.0496144480519485], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-1", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 77.41970486111111, 24.84809027777778], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-0", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 14.748086734693876, 9.765625], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 46.45182291666667, 15.13671875], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 6.289308176100629, 4.870528694968553, 3.4701749213836477], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 16.129032258064516, 34.13243447580645, 14.77444556451613], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-0", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 24.088541666666668, 16.30859375], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-0", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 18.529647435897434, 12.219551282051283], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-0", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 26.765046296296298, 17.28877314814815], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 52.9052734375, 22.998046875], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-1", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 73.34498355263158, 23.54029605263158], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 1.2738853503184713, 36.96506767515923, 16.679936305732483], "isController": true}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 60.46316964285714, 26.060267857142854], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 16.949152542372882, 35.867981991525426, 15.740863347457628], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 4.444444444444445, 18.68923611111111, 8.667534722222221], "isController": true}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-1", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 15.625, 21.7742919921875, 7.476806640625], "isController": false}, {"data": ["\/oes\/policy\/list-71-0", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 15.055338541666666, 9.521484375], "isController": false}, {"data": ["\/oes\/policy\/list-71-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["DataSouce create and save", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 2.352941176470588, 16.50735294117647, 8.340992647058824], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-1", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 11.627906976744185, 16.204124273255815, 5.257539970930233], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 48.92578125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-0", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 10.101010101010102, 7.29955808080808, 4.813762626262626], "isController": false}, {"data": ["\/oes\/policy\/list-54-0", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 31.25, 22.5830078125, 14.2822265625], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-1", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 66.35974702380952, 21.298363095238095], "isController": false}, {"data": ["\/oes\/policy\/list-54-1", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 7.518796992481203, 10.477854793233082, 3.3628994360902253], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-1", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 87.09716796875, 28.38134765625], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 17.857142857142858, 37.789481026785715, 16.741071428571427], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 5.405405405405405, 11.43897804054054, 5.020059121621622], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 32.55709134615385, 14.34795673076923], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 31.25, 66.131591796875, 28.62548828125], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 42.79641544117647, 26.53952205882353], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 96.19140625, 41.81463068181819], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 24.167115660919542, 11.920797413793105], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 58.783637152777786, 25.390625000000004], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 6.0606060606060606, 12.825520833333332, 5.480587121212121], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 25.809151785714285, 16.6015625], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 19.230769230769234, 40.69636418269231, 19.625150240384617], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 40.66051136363637], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-0", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 31.41983695652174, 20.210597826086957], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 68.2648689516129, 30.210433467741936], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-0", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 65.69602272727273, 42.96875], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 40.66051136363637], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 24.876644736842106], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 7.246376811594203, 15.235790307971014, 6.616564764492753], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-0", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 60.221354166666664, 39.0625], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 5.847953216374268, 12.375502558479532, 5.339683845029239], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-0", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 21.27659574468085, 15.37566489361702, 10.243517287234042], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 44.087727864583336, 19.34814453125], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-1", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 116.12955729166666, 37.272135416666664], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-0", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 23.311491935483872, 15.530493951612904], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-1", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 81.97380514705881, 26.309742647058822], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-0", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 36.1328125, 23.6328125], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-0", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 40.14756944444445, 25.878906250000004], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-1", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 69.677734375, 22.36328125], "isController": false}]}, function(index, item){
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
