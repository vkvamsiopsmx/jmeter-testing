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

    var data = {"OkPercent": 38.23529411764706, "KoPercent": 61.76470588235294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.32894736842105265, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.5, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [0.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 21, 61.76470588235294, 503.94117647058823, 21, 1224, 267.5, 1096.0, 1140.0, 1224.0, 0.9630636755041921, 0.9999918121884205, 0.4734546722750963], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 0.8914126362397821, 0.42308838555858314], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 35.91086647727273, 22.283380681818183], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 32.58463541666667, 15.0390625], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 1.6476894946808511, 1.0139627659574468], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 0.9250191446748351, 0.44916352497643736], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, 100.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.9416178070599613, 0.4533365570599613], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 16.47689494680851, 10.098071808510639], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 1091.0, 1091, 1091, 1091.0, 1091.0, 1091.0, 1091.0, 0.9165902841429882, 0.8986881301558204, 0.43860277268560954], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 1085.0, 1085, 1085, 1085.0, 1085.0, 1085.0, 1085.0, 0.9216589861751152, 0.9036578341013826, 0.43202764976958524], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, 100.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 20.426432291666668, 9.684244791666666], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 46.549479166666664, 21.484375], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 1068.0, 1068, 1068, 1068.0, 1068.0, 1068.0, 1068.0, 0.9363295880149812, 1.0478844803370786, 0.442562031835206], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 51.676432291666664, 9.847005208333334], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.9086828081556998, 0.42356927710843373], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, 100.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 20.426432291666668, 9.724934895833334], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, 100.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 11.141690340909092, 5.1935369318181825], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 14.55078125, 10.83984375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 1076.0, 1076, 1076, 1076.0, 1076.0, 1076.0, 1076.0, 0.929368029739777, 0.9112163104089219, 0.43382609200743494], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 1540.0, 1540, 1540, 1540.0, 1540.0, 1540.0, 1540.0, 0.6493506493506493, 9.152419845779221, 4.074294845779221], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 734.0, 734, 734, 734.0, 734.0, 734.0, 734.0, 1.3623978201634876, 1.0470772309264305, 0.7583659741144414], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 2.5538030660377355, 0.9231279481132075], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 1224.0, 1224, 1224, 1224.0, 1224.0, 1224.0, 1224.0, 0.8169934640522876, 1.1058134191176472, 0.3997204350490196], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 18.654847756410255, 13.897235576923077], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 20.257411858974358, 12.570112179487179], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 0.917238609813084, 0.624269859813084], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 18.02681587837838, 14.38450168918919], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 38.591056034482754, 16.298491379310345], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 16.341145833333336, 7.763671875], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, 100.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 14.209692028985506, 6.977468297101448], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 1.7084381991051454, 1.2343575223713645], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, 100.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 12.570112179487179, 6.009615384615385], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 48.63664215686275, 9.267769607843137], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 11289.0, 11289, 11289, 11289.0, 11289.0, 11289.0, 11289.0, 0.08858180529719195, 1.404592551377447, 0.6408339976968731], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 1112.0, 1112, 1112, 1112.0, 1112.0, 1112.0, 1112.0, 0.8992805755395684, 0.8817165017985611, 0.4180249550359712], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 1091.0, 1091, 1091, 1091.0, 1091.0, 1091.0, 1091.0, 0.9165902841429882, 0.8995832378551788, 0.4412880957836847], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, 100.0, 1057.0, 1057, 1057, 1057.0, 1057.0, 1057.0, 1057.0, 0.9460737937559129, 0.9220523888363293, 0.5543401135288553], "isController": false}, {"data": ["DataSource-Delete", 1, 1, 100.0, 2091.0, 2091, 2091, 2091.0, 2091.0, 2091.0, 2091.0, 0.47824007651841227, 0.9317274928263988, 0.5043938307030129], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 2215.0, 2215, 2215, 2215.0, 2215.0, 2215.0, 2215.0, 0.45146726862302483, 1.536928611738149, 0.971271867945824], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 21, 100.0, 61.76470588235294], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 21, "500", 21, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
