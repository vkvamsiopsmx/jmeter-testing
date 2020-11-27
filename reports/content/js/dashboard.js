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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8552631578947368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 271.2647058823529, 24, 1792, 92.5, 1369.0, 1738.0, 1792.0, 1.9216639348895042, 2.6563625974961846, 0.9119293293958062], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 1720.0, 1720, 1720, 1720.0, 1720.0, 1720.0, 1720.0, 0.5813953488372093, 0.6245457848837209, 0.26003815406976744], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 9.091796875, 4.716796875], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 17.978355532786885, 7.092085040983607], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 9.025804924242424, 4.62634154040404], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 12.311662946428571, 5.452473958333333], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 10.765719126506024, 5.588761295180722], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 13.538707386363635, 6.909919507575757], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 6.7693536931818175, 3.4845525568181817], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 17.548076923076923, 6.926081730769231], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 12.834821428571427, 6.375558035714285], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 43.8671875, 17.3046875], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 16.37124115566038, 4.283977004716982], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 21.275111607142854, 10.811941964285714], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 23.65186737804878, 10.694550304878048], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 15.13671875, 5.466368140243902], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 7.130342371323529, 3.224092371323529], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 5.682414010067115, 3.513003355704698], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 20.01953125, 7.229712701612903], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 4217.0, 4217, 4217, 4217.0, 4217.0, 4217.0, 4217.0, 0.23713540431586436, 4.705192524306379, 1.433464992885938], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 1684.0, 1684, 1684, 1684.0, 1684.0, 1684.0, 1684.0, 0.5938242280285035, 0.5335139548693587, 0.32648734412114017], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 10.390170784883722, 5.473292151162791], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 10.512408088235293, 5.537683823529411], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 4.364328286082474, 2.698131443298969], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 16.83666087962963, 8.734809027777779], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 6.380208333333334, 4.329427083333334], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 32.755533854166664, 21.402994791666668], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 11.72534839527027, 3.068253800675676], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 1.0191828747628082, 0.42435068785578745], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 37.174479166666664, 2.3737980769230766], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 1792.0, 1792, 1792, 1792.0, 1792.0, 1792.0, 1792.0, 0.5580357142857143, 0.4986354282924107, 0.3040858677455357], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 7.358870967741936, 2.904485887096774], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 6.205240885416667, 3.153483072916667], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 4520.0, 4520, 4520, 4520.0, 4520.0, 4520.0, 4520.0, 0.22123893805309736, 4.786236518252212, 1.5415427959070798], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 19.1156914893617, 9.495511968085106], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 34.684322667464116, 2.214787679425837], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 12.139042721518987, 7.355122626582278], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 11.435426311728394, 6.450135030864197], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 11.329933449074074, 6.410951967592593], "isController": true}]}, function(index, item){
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
