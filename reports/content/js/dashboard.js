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

    var data = {"OkPercent": 37.5, "KoPercent": 62.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35353535353535354, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-129"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/defaultLogTemplate-109"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-107"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-130"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-128"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-101"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-127"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-330"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-331"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-111"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-95"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/usergroups\/refresh-92"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/pipelineTemplates-108"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-97"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-91"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/17-321"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-329"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-89"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-105"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-113"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-93"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-43"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-102"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-134"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/usergroups-103"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/images-126"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-136"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-137"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-100"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-106"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/jmetertest\/releases-328"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-133"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-98"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/jmetertest"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-99"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/permissions-104"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases-332"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-40"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/applications-96"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-132"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-94"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/getClusterTags-110"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-135"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-325"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-39"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88, 55, 62.5, 281.3636363636364, 2, 13172, 13.5, 139.70000000000005, 219.09999999999988, 13172.0, 2.0882276168102325, 1.575370667817565, 0.9572356419520183], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 8095.0, 8095, 8095, 8095.0, 8095.0, 8095.0, 8095.0, 0.12353304508956145, 0.13221896232242122, 0.0575442016676961], "isController": false}, {"data": ["", 7, 7, 100.0, 90.42857142857143, 6, 431, 22.0, 431.0, 431.0, 431.0, 6.8493150684931505, 21.632483794031312, 23.109749571917806], "isController": true}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 68.19661458333333, 75.52083333333333], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 41.341145833333336, 18.798828125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 8.417544157608695, 5.180027173913044], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 53.5888671875], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.744140625, 4.74609375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 102.294921875, 105.46875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 143.22916666666666], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 11.460248161764705, 6.835937499999999], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 10.15870676100629, 2.9726808176100628], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 23.62738715277778, 12.695312500000002], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.634548611111114], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 118.5302734375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 48.78566576086956, 20.295516304347828], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 21.484375], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 29.227120535714285, 34.31919642857143], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 14384.0, 14384, 14384, 14384.0, 14384.0, 14384.0, 14384.0, 0.06952169076751946, 1.3156165270439377, 0.43620787420050056], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 3.2292213760504205, 2.338826155462185], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 58.45424107142857, 71.14955357142857], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 68.19661458333333, 106.28255208333333], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 4.425223214285714, 2.795758928571429], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 10.54404438405797, 7.854959239130434], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 18.373001453488374, 11.400799418604652], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, 100.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.3671875, 16.953125], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 81.8359375, 82.421875], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 59.9365234375], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 142.90364583333334], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 6.867955942622951, 5.523181352459017], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 58.45424107142857, 59.43080357142857], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 41.68701171875, 33.26416015625], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 23.144531249999996, 6.752232142857142], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, 100.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 15.737680288461538, 15.174278846153847], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 5.49404226618705, 3.9694806654676253], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 7.797590648854961, 3.57824427480916], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 54.443359375], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 24.507068452380953, 11.253720238095237], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 9300.0, 9300, 9300, 9300.0, 9300.0, 9300.0, 9300.0, 0.10752688172043011, 2.195690524193548, 0.7778897849462365], "isController": true}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 147.4609375], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 19.482421875, 11.62109375], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 54.70207555970149, 3.5928754664179103], "isController": false}, {"data": ["\/login-89", 1, 1, 100.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 2.0876514668367347, 2.844985650510204], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 14.272220799180328, 8.644979508196721], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 9.951202297507788, 6.720331970404985], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 141.27604166666666], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.203947368421055], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 48.177083333333336], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 139.97395833333334], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 19.7509765625, 12.255859375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 11.024567018072288, 5.741716867469879], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 58.45424107142857, 74.07924107142857], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 204.58984375, 223.6328125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 9.444073932926829, 5.835556402439024], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 58.45424107142857, 59.988839285714285], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 13.619791666666668, 6.25], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 17.406798245614034, 7.915296052631579], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 20.182291666666668, 9.267769607843137], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 15.145596590909092, 10.653409090909092], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 52.490234375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 22.89939413265306, 9.526466836734693], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 5.825931078767123, 3.1303510273972606], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 143.22916666666666], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 37.64204545454545], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 68.19661458333333, 73.56770833333333], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 31.475360576923077, 33.35336538461539], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 14.55078125, 10.83984375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 102.294921875, 105.224609375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 138.34635416666666], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 6.1953125, 3.9140625], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 204.58984375, 200.1953125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 102.294921875, 105.46875], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 143.88020833333334], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 42.3828125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 140.625], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 136.39322916666666], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 31.475360576923077, 32.30168269230769], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 140.625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 13.555270522388058, 6.996268656716418], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 13172.0, 13172, 13172, 13172.0, 13172.0, 13172.0, 13172.0, 0.07591861524445795, 0.08526016360461584, 0.03536443307774066], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 28.301459942084943, 1.8588622104247103], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 81.8359375, 85.7421875], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.35814144736842], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 46.11545138888889], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 68.19661458333333, 71.94010416666667], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, 100.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 68.19661458333333, 70.3125], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 24.06939338235294, 25.85018382352941], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 60.26785714285714, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 27.278645833333336, 28.125], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.4609375], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.200520833333336], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 41.30859375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 138.34635416666666], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 102.294921875, 104.98046875], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400\/Bad Request", 53, 96.36363636363636, 60.22727272727273], "isController": false}, {"data": ["500", 2, 3.6363636363636362, 2.272727272727273], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88, 55, "400\/Bad Request", 53, "500", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-89", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
