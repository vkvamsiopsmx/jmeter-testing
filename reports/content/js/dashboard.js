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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.868421052631579, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 591.2058823529412, 27, 8426, 75.5, 1257.0, 6898.25, 8426.0, 1.2192060816868076, 1.8612012877864237, 0.5993776221895507], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 1305.0, 1305, 1305, 1305.0, 1305.0, 1305.0, 1305.0, 0.7662835249042146, 0.7318606321839081, 0.35695043103448276], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 12.742565524193548, 7.907006048387097], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 23.274739583333332, 10.7421875], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 11.9140625, 7.331730769230769], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 16.33998325892857, 8.510044642857142], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 9.137834821428571, 5.580357142857142], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 11.063058035714285, 6.780133928571428], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 6.4001162190082646, 3.95467458677686], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 10.983702956989248, 5.040322580645161], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 13.208421610169491, 7.8787076271186445], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 20.79870345744681, 9.59940159574468], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 12.741449311023622, 3.7217027559055116], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 55.44845779220779, 6.138392857142858], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 31.50318287037037, 16.927083333333332], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 20.40127840909091, 8.487215909090908], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 21.2646484375, 11.42578125], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 15.479554521276595, 11.531748670212766], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 36.195816532258064, 15.05796370967742], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 8607.0, 8607, 8607, 8607.0, 8607.0, 8607.0, 8607.0, 0.11618450098756826, 2.6463743174160568, 0.7289896668409435], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 2.2805777077151332, 1.651752596439169], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 6389.0, 6389, 6389, 6389.0, 6389.0, 6389.0, 6389.0, 0.15651901706057286, 0.3017270895288777, 0.07657815190170605], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 8426.0, 8426, 8426, 8426.0, 8426.0, 8426.0, 8426.0, 0.11868027533823879, 0.22878404640398764, 0.0580652518988844], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 5.310504105839415, 3.956147354014598], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 11.61822150735294, 7.209329044117647], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 10.218178353658535, 8.145960365853659], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 17.10236378205128, 13.646834935897436], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 21.867081925675677, 6.387246621621622], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 1209.0, 1209, 1209, 1209.0, 1209.0, 1209.0, 1209.0, 0.8271298593879239, 0.7899736352357319, 0.38529388957816374], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 71.16948341836735, 4.912707270408163], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 3.2222441983122363, 2.328092035864979], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 14.187282986111112, 6.510416666666667], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 32.10173872180451, 3.5538063909774436], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 11103.0, 11103, 11103, 11103.0, 11103.0, 11103.0, 11103.0, 0.09006574799603712, 2.1913946399621724, 0.651569395658831], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 4.611224112426036, 2.7505547337278107], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 42.78901457055215, 2.95365222392638], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 13.883463541666668, 9.765625], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 11.115180121527779, 7.324218750000001], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 12.932534159919028, 8.709988613360323], "isController": true}]}, function(index, item){
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
