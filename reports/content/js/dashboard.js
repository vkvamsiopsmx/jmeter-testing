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

    var data = {"OkPercent": 61.76470588235294, "KoPercent": 38.23529411764706};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4605263157894737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [0.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 13, 38.23529411764706, 666.5294117647059, 23, 10383, 164.5, 1311.0, 5780.25, 10383.0, 1.1132575881601783, 1.4016762303133492, 0.5472919599882126], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 4.873095460199004, 2.317513992537313], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 5.724920742753623, 3.5524230072463765], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 42.50169836956522, 19.61616847826087], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 4.722036966463414, 2.9058689024390243], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 5.294552364864865, 2.5760135135135136], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, 100.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 8.91449254587156, 4.3004587155963305], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 4.6934185606060606, 2.8764204545454546], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 7.8359375, 3.828125], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 7.65228271484375, 3.662109375], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 3.2881724683544307, 1.9613660337552743], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 11.77757906626506, 5.435805722891566], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 7.9371675531914905, 3.352171985815603], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 18.567453022875817, 3.0892565359477127], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 6.313004032258065, 2.9485887096774195], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 5.582439365671641, 2.322372512437811], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 2.601180237003058, 1.3976490825688073], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 4.019552831491713, 2.9944319751381214], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 4.997409119897959, 2.3816167091836733], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 19213.0, 19213, 19213, 19213.0, 19213.0, 19213.0, 19213.0, 0.05204809243741217, 1.102972271378754, 0.3265712831155988], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 3.013939950980392, 2.182904411764706], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 10383.0, 10383, 10383, 10383.0, 10383.0, 10383.0, 10383.0, 0.09631127805065973, 0.14615988876047387, 0.04712104521814505], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 2.765975268031189, 0.953718932748538], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 2.362139813311688, 1.7597148944805194], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 19.26924542682927, 11.956935975609756], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 6.444027549342105, 4.39453125], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 6.233571845794392, 4.974080023364486], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 5.484029549319728, 1.6076743197278913], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 4246.0, 4246, 4246, 4246.0, 4246.0, 4246.0, 4246.0, 0.23551577955723035, 0.22516596502590672, 0.10970803403203014], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 908.0, 908, 908, 908.0, 908.0, 908.0, 908.0, 1.1013215859030838, 7.965222329295154, 0.5302261150881057], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 2.6795504385964914, 1.9359923245614037], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 1714.0, 1714, 1714, 1714.0, 1714.0, 1714.0, 1714.0, 0.5834305717619602, 0.5959652129521587, 0.2734830805134189], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 19.065908137583893, 3.1721895973154366], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 2612.0, 2612, 2612, 2612.0, 2612.0, 2612.0, 2612.0, 0.38284839203675347, 6.230259379785605, 2.7696688361408883], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 7.720226377952756, 3.6601870078740157], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 6.573773070469799, 3.2311765939597317], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, 100.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 8.165375525210084, 4.9238445378151265], "isController": false}, {"data": ["DataSource-Delete", 1, 1, 100.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 8.523506030701753, 4.625822368421052], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 5.583564244663383, 3.532622639573071], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 13, 100.0, 38.23529411764706], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 13, "500", 13, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
