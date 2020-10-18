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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7105263157894737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.5, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.5, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 882.7941176470586, 34, 6081, 3327.5, 4340.25, 6081.0, 0.7035404639228588, 1.0242721460053388, 0.33398772942661453], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 3355.0, 3355, 3355, 3355.0, 3355.0, 3355.0, 0.29806259314456035, 0.3198933494783905, 0.1333131520119225], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 6.172839506172839, 5.612220293209877, 2.911603009259259], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 1.9267822736030829, 2.141287331406551, 0.8335591281310212], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 1.9120458891013383, 2.5226308556405352, 0.8757319550669216], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 4.385964912280701, 5.0113075657894735, 2.0088061951754383], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 5.025125628140704, 6.629828831658291, 2.2917320979899496], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 6.25, 7.06787109375, 2.874755859375], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 14.285714285714285, 16.294642857142854, 6.431361607142857], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 10.526315789473683, 9.457236842105264, 4.6977796052631575], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 2.985074626865672, 3.3173973880597014, 1.2913945895522387], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 7.936507936507936, 13.764880952380953, 3.6039806547619047], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 5.9171597633136095, 7.379114275147929, 2.68699149408284], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 6.369426751592357, 6.108180732484076, 3.7009852707006368], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 16.666666666666668, 16.162109375, 7.307942708333334], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 6.993006993006993, 8.679796765734267, 3.134560751748252], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 3.0864197530864197, 2.9929832175925926, 1.353322723765432], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 8.771929824561402, 7.427014802631579, 4.59155701754386], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 14.084507042253522, 17.481844190140848, 6.313270246478874], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 19714.0, 19714, 19714, 19714.0, 19714.0, 19714.0, 0.05072537283149031, 1.0332322524601807, 0.3066309158466065], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 2551.0, 2551, 2551, 2551.0, 2551.0, 2551.0, 0.3920031360250882, 0.35219031752254015, 0.2155251617012936], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 3760.0, 3760, 3760, 3760.0, 3760.0, 3760.0, 0.26595744680851063, 0.3789374168882979, 0.12518700132978725], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1250.0, 1250, 1250, 1250.0, 1250.0, 1250.0, 0.8, 1.13984375, 0.3765625], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 2.688172043010753, 2.2760206653225805, 1.4070900537634408], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 17.543859649122805, 15.950520833333332, 8.275082236842104], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 10.638297872340425, 12.155086436170214, 4.934757313829787], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 2.331002331002331, 2.2308420745920747, 1.5274439102564104], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 6.0606060606060606, 4.764441287878788, 3.1131628787878785], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 2535.0, 2535, 2535, 2535.0, 2535.0, 2535.0, 0.3944773175542406, 0.6841715976331361, 0.17913276627218933], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 6081.0, 6081, 6081, 6081.0, 6081.0, 6081.0, 0.164446637066272, 0.17649106849202434, 0.0735513279065943], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 1.86219739292365, 12.8098812849162, 0.8619937150837989], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 3300.0, 3300, 3300, 3300.0, 3300.0, 3300.0, 0.30303030303030304, 0.27077414772727276, 0.1651278409090909], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 2.1141649048625792, 2.4114693446088795, 0.9517871300211417], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 1413.0, 1413, 1413, 1413.0, 1413.0, 1413.0, 0.7077140835102619, 0.8825692232837933, 0.3213740711252654], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 9029.0, 9029, 9029, 9029.0, 9029.0, 9029.0, 0.11075423634954036, 2.527878917931111, 0.7717104261269243], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 29.41176470588235, 26.424632352941174, 13.126148897058822], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 6.493506493506494, 44.6682224025974, 3.0057832792207795], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 3.9840637450199203, 8.372758964143426, 4.163035358565737], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 4.1185877815866805, 2.040164360920666], "isController": true}]}, function(index, item){
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
