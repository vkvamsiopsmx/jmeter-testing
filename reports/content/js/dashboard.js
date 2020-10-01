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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7763157894736842, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.5, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.5, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 621.9117647058823, 20, 6699, 1696.5, 4697.25, 6699.0, 0.7707653246282191, 0.9740608777090134, 0.37905112271037356], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 4030.0, 4030, 4030, 4030.0, 4030.0, 4030.0, 0.24813895781637718, 0.23674976736972703, 0.11558816687344912], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 27.24272629310345, 16.904633620689655], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 5.0, 4.9609375, 2.255859375], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 16.83508831521739, 10.360054347826088], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 5.714285714285714, 5.228794642857143, 2.723214285714286], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 10.101010101010102, 7.822364267676767, 4.794034090909091], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 6.5359477124183005, 5.061529820261438, 3.1275531045751634], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 6.024096385542169, 6.153520331325301, 2.8237951807228914], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 18.18181818181818, 14.169034090909092, 8.451704545454545], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 49.609375, 22.55859375], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 21.27659574468085, 34.366688829787236, 10.056515957446809], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 2.8089887640449436, 3.091533532303371, 1.327686095505618], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 6.097560975609756, 5.079315929878049, 3.5727896341463414], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 4.484304932735426, 3.8142867152466366, 2.0494674887892375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 12.195121951219512, 13.683784298780488, 5.6926448170731705], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 1.9569471624266144, 1.6645517367906066, 0.8943860078277887], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 1.5923566878980893, 1.1585016918789808, 0.8630448845541401], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 8.474576271186441, 9.509070444915254, 3.955905720338983], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 12198.0, 12198, 12198, 12198.0, 12198.0, 12198.0, 0.08198065256599443, 1.495266257788162, 0.5143805593130021], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 1.3947001394700138, 1.071903329846583, 0.7763467573221757], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 2340.0, 2340, 2340, 2340.0, 2340.0, 2340.0, 0.42735042735042733, 0.5091479700854701, 0.20908453525641027], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1008.0, 1008, 1008, 1008.0, 1008.0, 1008.0, 0.992063492063492, 1.1819506448412698, 0.48537481398809523], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 8.547008547008549, 6.218282585470085, 4.632411858974359], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 3.875968992248062, 3.0621669089147288, 1.9001332364341086], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 10.416666666666666, 9.46044921875, 4.8828125], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 2.8011204481792715, 2.34703256302521, 1.8874737394957983], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 16.949152542372882, 11.304952330508476, 9.020789194915254], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 15.151515151515152, 24.473248106060606, 7.161458333333333], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 6699.0, 6699, 6699, 6699.0, 6699.0, 6699.0, 0.14927601134497684, 0.14242447566801014, 0.06953579825347067], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 1.834862385321101, 11.616614105504587, 0.8833858944954128], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 1053.0, 1053, 1053, 1053.0, 1053.0, 1053.0, 0.9496676163342831, 0.7252344491927826, 0.5239865265906933], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 2.9585798816568047, 3.022143121301775, 1.386834319526627], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 6.134969325153374, 6.752060966257669, 2.8997315950920246], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 7997.0, 7997, 7997, 7997.0, 7997.0, 7997.0, 0.12504689258471927, 2.4750492372139554, 0.9046361135425784], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 20.0, 15.5859375, 9.296875], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 5.649717514124294, 35.76867055084746, 2.720030014124294], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 3.8461538461538463, 6.696965144230769, 4.056490384615384], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 1.4492753623188406, 4.629472373188406, 3.1264153079710146], "isController": true}]}, function(index, item){
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
