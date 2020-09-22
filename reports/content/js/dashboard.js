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

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 32, 100.0, 130962.78124999997, 129547, 131168, 131081.1, 131112.75, 131168.0, 0.007591377049701457, 0.02003115311356771, 0.0], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 131070.0, 131070, 131070, 131070.0, 131070.0, 131070.0, 0.007629510948348211, 0.020131775959411003, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, 100.0, 131083.0, 131083, 131083, 131083.0, 131083.0, 131083.0, 0.007628754300710237, 0.020129779414569397, 0.0], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, 100.0, 130868.0, 130868, 130868, 130868.0, 130868.0, 130868.0, 0.007641287404101843, 0.020162850161995295, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, 100.0, 131079.0, 131079, 131079, 131079.0, 131079.0, 131079.0, 0.007628987099382815, 0.020130393693879263, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 131074.0, 131074, 131074, 131074.0, 131074.0, 131074.0, 0.007629278117704503, 0.02013116159573981, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, 100.0, 131065.0, 131065, 131065, 131065.0, 131065.0, 131065.0, 0.007629802006637928, 0.020132543966734064, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 131067.0, 131067, 131067, 131067.0, 131067.0, 131067.0, 0.007629685580657221, 0.020132236756773253, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 131073.0, 131073, 131073, 131073.0, 131073.0, 131073.0, 0.007629336324033172, 0.020131315183142217, 0.0], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, 100.0, 131062.0, 131062, 131062, 131062.0, 131062.0, 131062.0, 0.007629976652271444, 0.020133004799255314, 0.0], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, 100.0, 130827.0, 130827, 130827, 130827.0, 130827.0, 130827.0, 0.00764368211454822, 0.020169169017098917, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 131059.0, 131059, 131059, 131059.0, 131059.0, 131059.0, 0.007630151305900395, 0.020133465652873897, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, 100.0, 131064.0, 131064, 131064, 131064.0, 131064.0, 131064.0, 0.007629860220960752, 0.020132697575230424, 0.0], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 131061.0, 131061, 131061, 131061.0, 131061.0, 131061.0, 0.007630034869259352, 0.020133158414783955, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, 100.0, 130928.0, 130928, 130928, 130928.0, 130928.0, 130928.0, 0.007637785653183429, 0.02015361019033362, 0.0], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, 100.0, 131065.0, 131065, 131065, 131065.0, 131065.0, 131065.0, 0.007629802006637928, 0.020132543966734064, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, 100.0, 131075.0, 131075, 131075, 131075.0, 131075.0, 131075.0, 0.007629219912263971, 0.02013100801068091, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 131013.0, 131013, 131013, 131013.0, 131013.0, 131013.0, 0.0076328303298145985, 0.020140534717928753, 0.0], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 1702096.0, 1702096, 1702096, 1702096.0, 1702096.0, 1702096.0, 5.875109277032552E-4, 0.020153231295414596, 0.0], "isController": true}, {"data": ["\/login-59", 1, 1, 100.0, 129937.0, 129937, 129937, 129937.0, 129937.0, 129937.0, 0.007696037310388881, 0.020307317199873783, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 131058.0, 131058, 131058, 131058.0, 131058.0, 131058.0, 0.007630209525553573, 0.020133619275435305, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 131036.0, 131036, 131036, 131036.0, 131036.0, 131036.0, 0.007631490582740622, 0.020136999565005035, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, 100.0, 131074.0, 131074, 131074, 131074.0, 131074.0, 131074.0, 0.007629278117704503, 0.02013116159573981, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, 100.0, 131077.0, 131077, 131077, 131077.0, 131077.0, 131077.0, 0.00762910350404724, 0.0201307008475934, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 131026.0, 131026, 131026, 131026.0, 131026.0, 131026.0, 0.00763207302367469, 0.020138536435516614, 0.0], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, 100.0, 131067.0, 131067, 131067, 131067.0, 131067.0, 131067.0, 0.007629685580657221, 0.020132236756773253, 0.0], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 131012.0, 131012, 131012, 131012.0, 131012.0, 131012.0, 0.007632888590358136, 0.020140688448386408, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 131082.0, 131082, 131082, 131082.0, 131082.0, 131082.0, 0.007628812499046398, 0.020129932980882198, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, 100.0, 131074.0, 131074, 131074, 131074.0, 131074.0, 131074.0, 0.007629278117704503, 0.02013116159573981, 0.0], "isController": false}, {"data": ["\/login-42", 1, 1, 100.0, 129547.0, 129547, 129547, 129547.0, 129547.0, 129547.0, 0.00771920615683883, 0.02036845218337746, 0.0], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, 100.0, 131168.0, 131168, 131168, 131168.0, 131168.0, 131168.0, 0.0076238106855330565, 0.020116734836240546, 0.0], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, 100.0, 131075.0, 131075, 131075, 131075.0, 131075.0, 131075.0, 0.007629219912263971, 0.02013100801068091, 0.0], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 1964481.0, 1964481, 1964481, 1964481.0, 1964481.0, 1964481.0, 5.090403012296886E-4, 0.020147854891444612, 0.0], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 130969.0, 130969, 130969, 130969.0, 130969.0, 130969.0, 0.007635394635371729, 0.020147301078881262, 0.0], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 131074.0, 131074, 131074, 131074.0, 131074.0, 131074.0, 0.007629278117704503, 0.02013116159573981, 0.0], "isController": false}, {"data": ["DataSouce create and save", 1, 1, 100.0, 524232.0, 524232, 524232, 524232.0, 524232.0, 524232.0, 0.0019075523813883932, 0.020133619275435305, 0.0], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 32, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 32, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 32, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-44", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-61", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-59", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/login-42", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to gitpr-gate-nightly.oes.opsmx.com:8084 [gitpr-gate-nightly.oes.opsmx.com\\\/40.90.217.183] failed: Operation timed out (Connection timed out)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
