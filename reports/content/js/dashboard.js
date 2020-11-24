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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.5, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [0.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 13, 38.23529411764706, 571.5294117647059, 17, 1926, 179.0, 1127.5, 1369.5, 1926.0, 1.179981953217186, 1.611053600246408, 0.5800945287013257], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.8722174657534246, 0.4254066780821918], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 10.128705929487179, 6.285056089743589], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 41.341145833333336, 18.798828125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, 100.0, 1092.0, 1092, 1092, 1092.0, 1092.0, 1092.0, 1092.0, 0.9157509157509157, 0.9810339400183149, 0.43641254578754574], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 1.0757805150517403, 0.4483184383819379], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, 100.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 1.0632666471962615, 0.4380841121495327], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, 100.0, 1113.0, 1113, 1113, 1113.0, 1113.0, 1113.0, 1113.0, 0.8984725965858041, 0.9563819631626236, 0.4264235175202156], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 1.0807660528800755, 0.4518561142587347], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 12.307040662650602, 5.647590361445783], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 17.317708333333336, 10.32986111111111], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 8.703399122807017, 3.9576480263157894], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 8.25821314102564, 2.423878205128205], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, 100.0, 1087.0, 1087, 1087, 1087.0, 1087.0, 1087.0, 1087.0, 0.9199632014719411, 0.9037919733210672, 0.4348263569457222], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 14.416710805084746, 7.746292372881356], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 17.5323486328125, 7.293701171875], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 8.860270182291666, 4.7607421875], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, 100.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 0.8289234058277027, 0.457763671875], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 29.528166118421055, 12.284128289473685], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 6001.0, 6001, 6001, 6001.0, 6001.0, 6001.0, 6001.0, 0.16663889351774705, 3.158490511998, 1.045561416847192], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 1.1090255230880233, 0.8032332251082251], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 1096.0, 1096, 1096, 1096.0, 1096.0, 1096.0, 1096.0, 0.9124087591240876, 1.0318059990875912, 0.4464031135948905], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 1071.0, 1071, 1071, 1071.0, 1071.0, 1071.0, 1071.0, 0.9337068160597572, 1.0577147525676938, 0.4568233543417367], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, 100.0, 1088.0, 1088, 1088, 1088.0, 1088.0, 1088.0, 1088.0, 0.9191176470588235, 0.9020637063419117, 0.49815458409926466], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 32.918294270833336, 20.426432291666668], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 1086.0, 1086, 1086, 1086.0, 1086.0, 1086.0, 1086.0, 0.9208103130755064, 1.0538961786372008, 0.6150725138121547], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 39.23483455882353, 31.307444852941174], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 11.261199737762238, 3.3052884615384617], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 1926.0, 1926, 1926, 1926.0, 1926.0, 1926.0, 1926.0, 0.5192107995846313, 0.49588687694704053, 0.24185893691588786], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 74.19797207446808, 5.121758643617021], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 4.685103527607362, 3.3850172546012267], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 15.960693359375, 7.32421875], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, 100.0, 1120.0, 1120, 1120, 1120.0, 1120.0, 1120.0, 1120.0, 0.8928571428571428, 0.8771623883928571, 0.4220145089285714], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 7947.0, 7947, 7947, 7947.0, 7947.0, 7947.0, 7947.0, 0.1258336479174531, 2.6647486866112997, 0.9103277966528249], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 33.0, 30.303030303030305, 23.615056818181817, 14.086174242424242], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 58.12174479166667, 4.012044270833334], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, 100.0, 1135.0, 1135, 1135, 1135.0, 1135.0, 1135.0, 1135.0, 0.881057268722467, 0.9980726872246696, 0.5162444933920705], "isController": false}, {"data": ["DataSource-Delete", 1, 1, 100.0, 2205.0, 2205, 2205, 2205.0, 2205.0, 2205.0, 2205.0, 0.45351473922902497, 1.0297087585034013, 0.47831632653061223], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 3279.0, 3279, 3279, 3279.0, 3279.0, 3279.0, 3279.0, 0.3049710277523635, 1.2258405763952425, 0.6561046622445867], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 8, 61.53846153846154, 23.529411764705884], "isController": false}, {"data": ["401", 5, 38.46153846153846, 14.705882352941176], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 13, "500", 8, "401", 5, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, "401", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
