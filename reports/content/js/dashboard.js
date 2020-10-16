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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6710526315789473, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.5, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.5, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 916.5882352941177, 53, 7616, 2498.0, 5305.25, 7616.0, 0.8330270733798848, 1.2096071833272082, 0.39545816489035895], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 2999.0, 2999, 2999, 2999.0, 2999.0, 2999.0, 0.33344448149383127, 0.35786668472824273, 0.14913825441813938], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 10.416666666666666, 9.470621744791666, 4.913330078125], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 2.4330900243309004, 2.7039613746958637, 1.0525965632603407], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 2.544529262086514, 3.357088899491094, 1.1654142811704835], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 2.2222222222222223, 2.5130208333333335, 1.0177951388888888], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 6.172839506172839, 8.14404899691358, 2.8151523919753085], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 2.4813895781637716, 2.5807420905707192, 1.141342276674938], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 5.9880239520958085, 6.830089820359281, 2.6957803143712575], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 8.0, 7.1875, 3.5703125], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 14.925373134328359, 16.586986940298505, 6.4569729477611935], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 2.314814814814815, 4.026059751157407, 1.0511610243055556], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 8.403361344537815, 10.167738970588236, 3.8159795168067228], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 2.688172043010753, 2.57791498655914, 1.5619749663978495], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 7.407407407407407, 7.183159722222221, 3.2479745370370368], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 4.761904761904763, 5.910528273809524, 2.134486607142857], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 1.7699115044247788, 1.7163301991150444, 0.7760647123893806], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 4.464285714285714, 3.779820033482143, 2.3367745535714284], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 10.752688172043012, 13.346354166666666, 4.819808467741936], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 20734.0, 20734, 20734, 20734.0, 20734.0, 20734.0, 0.04822996045143243, 0.9820260502073888, 0.2915463429632488], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 1148.0, 1148, 1148, 1148.0, 1148.0, 1148.0, 0.8710801393728222, 0.7826110627177701, 0.47892394381533104], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 4535.0, 4535, 4535, 4535.0, 4535.0, 4535.0, 0.22050716648291072, 0.3003979465270121, 0.10379341234840132], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1743.0, 1743, 1743, 1743.0, 1743.0, 1743.0, 0.5737234652897303, 0.7843875502008032, 0.2700534279977051], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 1.1363636363636362, 0.9621360085227273, 0.5948153409090909], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 18.867924528301884, 17.154333726415096, 8.89961674528302], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 7.352941176470588, 8.315142463235293, 3.410788143382353], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 2.320185614849188, 2.220490139211137, 1.5203560034802786], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 12.195121951219512, 9.586985518292682, 6.264291158536585], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 1959.0, 1959, 1959, 1959.0, 1959.0, 1959.0, 0.5104645227156713, 0.8878294091373149, 0.23180273736600304], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 7616.0, 7616, 7616, 7616.0, 7616.0, 7616.0, 0.13130252100840337, 0.14091940487132354, 0.058727104122899165], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 1.1547344110854503, 8.043672416281755, 0.534515733256351], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 1997.0, 1997, 1997, 1997.0, 1997.0, 1997.0, 0.500751126690035, 0.4474485165247872, 0.27287024286429645], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 1.2658227848101267, 1.4438291139240507, 0.5698674841772151], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 1.461988304093567, 1.7689487390350875, 0.663891173245614], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 8797.0, 8797, 8797, 8797.0, 8797.0, 8797.0, 0.11367511651699443, 2.5833336293622824, 0.7920624573718312], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 13.888888888888888, 12.478298611111112, 6.198459201388889], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 1.335113484646195, 9.293641522029372, 0.618011515353805], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 1.968503937007874, 4.113865649606299, 2.0569328248031495], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 1125.0, 1125, 1125, 1125.0, 1125.0, 1125.0, 0.888888888888889, 3.7274305555555554, 1.8515625], "isController": true}]}, function(index, item){
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
