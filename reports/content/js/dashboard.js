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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8552631578947368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.5, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.5, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 336.8529411764706, 58, 2262, 933.0, 1641.0, 2262.0, 1.5116485861639692, 1.8137525286768628, 0.7434066834874622], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 2262.0, 2262, 2262, 2262.0, 2262.0, 2262.0, 0.44208664898320066, 0.42179556255526085, 0.20593294098143236], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 2.5974025974025974, 2.052049512987013, 1.2733360389610389], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 1.4388489208633093, 1.427607913669065, 0.6491681654676259], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 6.41025641025641, 4.964192708333333, 3.0548878205128207], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 6.024096385542169, 5.512283509036144, 2.8708584337349397], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 9.174311926605505, 7.104716169724771, 4.354214449541284], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 3.745318352059925, 2.9004272003745317, 1.792193352059925], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 10.416666666666666, 10.640462239583334, 4.8828125], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 12.658227848101266, 9.86451740506329, 5.884098101265823], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 9.174311926605505, 9.1026376146789, 4.139191513761468], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 8.928571428571429, 14.46533203125, 4.220145089285714], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 2.6595744680851063, 2.059611868351064, 1.2570644946808511], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 9.00900900900901, 7.504574887387387, 5.278716216216216], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 8.771929824561402, 7.461280153508771, 4.009046052631579], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 9.433962264150942, 10.585568985849056, 4.403744103773585], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 5.9171597633136095, 5.033052884615384, 2.704326923076923], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 2.3696682464454977, 1.7240262144549763, 1.2843416765402844], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 12.897359913793105, 5.365481321839081], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 5920.0, 5920, 5920, 5920.0, 5920.0, 5920.0, 0.16891891891891891, 2.8970254434121623, 1.0598672402871623], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 4.807692307692308, 3.6949744591346154, 2.6761568509615388], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 7.042253521126761, 5.453620158450705, 3.445477552816902], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 6.993006993006993, 5.415482954545455, 3.4213833041958046], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 1.8484288354898337, 1.34480418207024, 1.0018339879852125], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 10.416666666666666, 8.229573567708334, 5.106608072916667], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 10.439116379310345, 5.387931034482759], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 4.975124378109452, 4.168610074626866, 3.3523787313432836], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 17.241379310344826, 11.499865301724137, 9.176320043103448], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 3.4602076124567476, 5.589046280276817, 1.6354887543252596], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.8147750320239111, 0.3977970217762596], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 2.444987775061125, 14.634111399755502, 1.177127903422983], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 1434.0, 1434, 1434, 1434.0, 1434.0, 1434.0, 0.6973500697350069, 0.5325466352859135, 0.38476834902370993], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 2.857142857142857, 2.918526785714286, 1.3392857142857144], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 6.666666666666667, 5.162760416666667, 3.151041666666667], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 4801.0, 4801, 4801, 4801.0, 4801.0, 4801.0, 0.20828993959591752, 3.8968932253697144, 1.5068475317642158], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 4.672897196261682, 3.641574182242991, 2.1721670560747666], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 7.194244604316547, 43.06008318345323, 3.4636353417266186], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 5.050505050505051, 8.793994633838384, 5.326704545454545], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 1.8726591760299625, 5.981902504681647, 4.039750117041199], "isController": true}]}, function(index, item){
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
