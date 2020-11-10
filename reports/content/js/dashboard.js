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

    var data = {"OkPercent": 41.30434782608695, "KoPercent": 58.69565217391305};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3592233009708738, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-129"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/defaultLogTemplate-109"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-128"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-101"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-127"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-330"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-331"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-111"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-95"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/pipelineTemplates-108"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-97"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-91"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-329"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-89"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-105"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-113"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-93"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-102"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-134"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-136"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-137"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-100"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-106"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-133"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases-332"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-40"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/applications-96"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-94"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/getClusterTags-110"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-39"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-107"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-130"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/usergroups\/refresh-92"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/17-321"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-43"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/usergroups-103"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/images-126"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/jmetertest\/releases-328"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-98"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/jmetertest"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-99"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/permissions-104"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-132"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-135"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-325"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 54, 58.69565217391305, 142.83695652173913, 1, 4687, 21.0, 146.5000000000001, 326.79999999999984, 4687.0, 2.4187611736249868, 1.9818036284703964, 1.1247311346487538], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 4687.0, 4687, 4687, 4687.0, 4687.0, 4687.0, 4687.0, 0.2133560913164071, 0.20377173565180284, 0.09938560113078727], "isController": false}, {"data": ["", 7, 7, 100.0, 139.14285714285717, 18, 492, 90.0, 492.0, 492.0, 492.0, 4.260499087035909, 13.456710286062082, 14.36789124315277], "isController": true}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 45.3125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 20.379317434210527, 12.541118421052632], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.56373355263158], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 21.511501736111114, 13.183593750000002], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 27.278645833333336, 28.125], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 55.6640625, 33.203125], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 12.151227678571427, 6.529017857142857], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 117.7978515625], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 37.109375], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 34.098307291666664, 40.0390625], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 26.212993421052634], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 47.81788793103448, 15.557650862068964], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 70.20399305555556], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 29.694733796296298, 19.31423611111111], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.09201388888889], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 204.58984375, 206.0546875], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 31.475360576923077, 32.97776442307693], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 81.8359375, 83.203125], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 27.278645833333336, 26.302083333333336], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 23.283305921052634], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 13.671875, 8.15515350877193], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 48.591759554140125, 3.066530652866242], "isController": false}, {"data": ["\/login-89", 1, 1, 100.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 2.0357198383084576, 2.7742148631840795], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 31.321281934306565, 12.823619981751824], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 24.18664383561644, 14.73539169520548], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.52982954545455], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, 100.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 15.737680288461538, 16.22596153846154], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 43.359375], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, 100.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 17.790421195652176, 18.257472826086957], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 26.334635416666668, 16.341145833333336], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 25.57373046875, 26.2451171875], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 33.66887019230769, 14.963942307692307], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 19.99627976190476], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 19.685444078947366, 8.189418859649123], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 17.720540364583332, 9.521484375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.61513157894737], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.26349431818182], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 23.057725694444446], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 3.6911231884057973, 1.418138586956522], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, 100.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 33.0, 30.303030303030305, 12.399384469696969, 12.133049242424242], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 42.1875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 25.57373046875, 26.4892578125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 42.1875], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 29.227120535714285, 29.994419642857142], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.35227272727273], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 29.201931423611114, 10.891384548611112], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 4259.0, 4259, 4259, 4259.0, 4259.0, 4259.0, 4259.0, 0.23479690068091102, 0.22424938365813568, 0.10937316564921343], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 62.572041495901644, 3.9462730532786887], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.96006944444445], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 46.875], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 24.06939338235294, 25.85018382352941], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 34.098307291666664, 35.563151041666664], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 18.599076704545457, 19.309303977272727], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 18.599076704545457, 19.087357954545457], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 16.816737288135595, 7.64698093220339], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 58.45424107142857, 61.38392857142857], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 23.82525275735294, 6.950827205882352], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 20.414806547619047], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 6.926359953703703, 2.8814621913580245], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 5503.0, 5503, 5503, 5503.0, 5503.0, 5503.0, 5503.0, 0.1817190623296384, 3.577416579592949, 1.140180640105397], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 2.42446273659306, 1.7559641167192428], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 23.090977822580644, 13.041834677419354], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 47.81788793103448, 13.099407327586206], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 5.013020833333333, 1.9186580882352942], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 12.125651041666668, 9.033203125], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 21.94552951388889, 13.617621527777779], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 102.294921875, 119.873046875], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 19.287109375, 11.928013392857142], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 37.05512152777778, 29.568142361111114], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 20.977069805194805, 6.138392857142858], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 1.9187735552763818, 1.3863261620603013], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 13.803842905405405, 6.33445945945946], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 43.5546875], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 23.14453125, 9.453125], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 6265.0, 6265, 6265, 6265.0, 6265.0, 6265.0, 6265.0, 0.15961691939345568, 3.4270874900239425, 1.1547286512370312], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 28.04904513888889, 13.237847222222223], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 24.693080357142854], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 44.7265625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 10.409954896907216, 4.933150773195877], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 16.2140376984127, 7.440476190476191], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 27.56076388888889, 12.532552083333334], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 17.803485576923077, 7.271634615384615], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 27.278645833333336, 27.604166666666668], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 24.522569444444446], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 48.177083333333336], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 10.85879197761194, 8.089435634328357], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 23.980034722222225], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 102.294921875, 102.294921875], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, 100.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 15.15480324074074, 15.87818287037037], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 24.06939338235294, 24.988511029411764], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 31.475360576923077, 31.926081730769234], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 422.8515625, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, 100.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 10.767886513157896, 11.101973684210527], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 22.94921875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 25.57373046875, 25.93994140625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400\/Bad Request", 53, 98.14814814814815, 57.608695652173914], "isController": false}, {"data": ["422", 1, 1.8518518518518519, 1.0869565217391304], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 92, 54, "400\/Bad Request", 53, "422", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-89", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "422", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
