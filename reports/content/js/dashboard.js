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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 0, 0.0, 21.858695652173914, 5, 162, 38.0, 50.349999999999994, 162.0, 10.238148230580904, 14.062021825617627, 6.352764021811707], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 105.810546875, 45.654296875], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-1", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 63.34339488636364, 21.75071022727273], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 38.46153846153847, 27.982271634615387, 17.352764423076923], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62-0", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 26.765046296296298, 20.07378472222222], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 117.56727430555557, 51.70355902777778], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-0", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 48.177083333333336, 36.1328125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 105.810546875, 46.337890625], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-1", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 49.76981026785714, 15.973772321428571], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-1", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 174.1943359375, 55.908203125], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 19.017269736842106, 17.73231907894737], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 49.0234375], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77-1", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 174.1943359375, 60.4248046875], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 75.57896205357143, 32.57533482142857], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 55.6897615131579, 24.208470394736842], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 52.517361111111114], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-1", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 77.41970486111111, 24.84809027777778], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 52.73437500000001], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 54.470486111111114], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 92.00917119565217, 39.31725543478261], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 41.104403409090914], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-1", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 22.727272727272727, 31.67169744318182, 10.165127840909092], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 46.875], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 141.08072916666669, 60.9375], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 1.984126984126984, 49.167209201388886, 22.272987971230158], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 6.172839506172839, 4.810474537037037, 3.4360532407407405], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 79.53559027777779, 52.083333333333336], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 138.671875, 45.1171875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 138.671875, 44.43359375], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 39.76779513888889, 32.552083333333336], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 19.607843137254903, 41.49433210784314, 18.363204656862745], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 78.37818287037037, 37.796585648148145], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 52.9052734375, 23.4375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-0", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 103.23660714285714, 66.68526785714286], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 21.27659574468085, 45.025764627659576, 24.62184175531915], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 31.761532738095237, 25.344122023809522], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 117.56727430555557, 51.106770833333336], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-1", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 174.1943359375, 55.908203125], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 38.03453947368421, 24.51685855263158], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63-1", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 174.1943359375, 55.908203125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-0", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 60.221354166666664, 39.876302083333336], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 45.41015625], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 7.142857142857142, 5.531529017857142, 3.9411272321428568], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 17.857142857142858, 37.789481026785715, 16.357421875], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-0", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 24.919181034482758, 16.87095905172414], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75-0", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 90.33203125, 59.5703125], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-0", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 48.177083333333336, 31.119791666666668], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 68.2648689516129, 29.674899193548388], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48-1", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 63.34339488636364, 20.330255681818183], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 1.858736059479554, 53.936018819702596, 24.337825278810406], "isController": true}, {"data": ["\/oes\/dashboard\/dynamicMenu-46-1", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 116.12955729166666, 37.272135416666664], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 60.46316964285714, 26.060267857142854], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 72.97279094827586, 32.0245150862069], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 20.833333333333332, 87.60579427083333, 40.629069010416664], "isController": true}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 47.8515625], "isController": false}, {"data": ["\/oes\/policy\/list-71-0", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 51.61830357142857, 32.645089285714285], "isController": false}, {"data": ["\/oes\/policy\/list-71-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 49.69618055555556], "isController": false}, {"data": ["DataSouce create and save", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 9.345794392523365, 65.56658878504673, 33.13011098130841], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 45.21484375], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-0", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 90.33203125, 61.1572265625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 52.95138888888889], "isController": false}, {"data": ["\/oes\/policy\/list-54-0", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 60.221354166666664, 38.0859375], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65-1", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 107.19651442307693, 34.40504807692308], "isController": false}, {"data": ["\/oes\/policy\/list-54-1", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 99.53962053571428, 31.947544642857142], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74-1", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 154.83940972222223, 50.45572916666667], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 78.37818287037037, 34.72222222222222], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 48.87952302631579], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 100.7719494047619, 44.41034226190476], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 100.7719494047619, 43.619791666666664], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 55.964543269230774, 34.70552884615385], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 68.2648689516129, 29.674899193548388], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 72.50134698275862, 35.76239224137931], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 78.37818287037037, 33.854166666666664], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-1", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 73.34498355263158, 23.54029605263158], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 78.37818287037037, 33.492476851851855], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 51.64930555555556], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 20.0, 42.32421875, 20.41015625], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-1", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 49.76981026785714, 15.973772321428571], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 166.66666666666666, 120.44270833333333, 77.47395833333333], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 96.19140625, 42.569247159090914], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-0", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 55.588942307692314, 36.35817307692308], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 40.66051136363637], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 46.45182291666667, 14.908854166666668], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68-0", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 103.23660714285714, 67.52232142857143], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 110.65995065789474, 48.05715460526316], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-1", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 278.7109375, 89.453125], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66-0", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 45.166015625, 29.296875], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 78.37818287037037, 33.81799768518518], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-0", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 60.221354166666664, 40.120442708333336], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 111.3795230263158, 48.87952302631579], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70-1", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 81.97380514705881, 26.309742647058822], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-0", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 80.2951388888889, 53.493923611111114], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 126.68678977272728, 40.66051136363637], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50-0", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 36.1328125, 23.6328125], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 72.265625, 46.58203125], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-69-1", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 139.35546875, 44.7265625], "isController": false}]}, function(index, item){
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
