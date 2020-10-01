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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6447368421052632, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.5, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.5, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [0.5, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.5, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 971.4117647058823, 27, 5998, 2685.5, 5582.5, 5998.0, 0.5471163748712667, 0.7595294044879635, 0.25972941876931], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 2717.0, 2717, 2717, 2717.0, 2717.0, 2717.0, 0.368052999631947, 0.3950100064409275, 0.16461745491350754], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 3.3557046979865772, 3.0509385486577183, 1.5828177432885906], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 1.6051364365971108, 1.7838332664526484, 0.6944096107544141], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 1.3812154696132597, 1.234191557320442, 0.6326074758287293], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 5.319148936170213, 6.010014960106383, 2.4362117686170213], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 2.544529262086514, 2.2736760496183206, 1.1604444974554706], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 2.4752475247524752, 2.57435411509901, 1.138517172029703], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 5.847953216374268, 6.6703216374269, 2.632721125730994], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 4.9504950495049505, 4.447710396039604, 2.2093517945544554], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 1.8796992481203008, 2.0889626409774436, 0.8131902020676691], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 7.874015748031496, 13.694943405511811, 3.575602854330709], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 2.638522427440633, 3.0662516490765173, 1.1981571569920844], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 3.745318352059925, 3.591701779026217, 2.1762347846441945], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 7.633587786259541, 7.40249284351145, 3.3471493320610683], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 4.901960784313726, 6.084367340686275, 2.197265625], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 2.6737967914438503, 2.5928517713903743, 1.1723972259358288], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 2.631578947368421, 2.2281044407894735, 1.377467105263158], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 6.024096385542169, 7.477174322289156, 2.700254141566265], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 21134.0, 21134, 21134, 21134.0, 21134.0, 21134.0, 0.04731711933377496, 0.9322951168732847, 0.28602828972272165], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 2654.0, 2654, 2654, 2654.0, 2654.0, 2654.0, 0.37678975131876413, 0.3385220422004522, 0.20716077147701584], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 2487.0, 2487, 2487, 2487.0, 2487.0, 2487.0, 0.4020908725371934, 0.5077182599517491, 0.1892654302372336], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1583.0, 1583, 1583, 1583.0, 1583.0, 1583.0, 0.6317119393556537, 0.7976597046746684, 0.29734878395451675], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 1.5772870662460567, 1.335456920347003, 0.8256111987381703], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 10.450341235632184, 5.421605603448276], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 2.7247956403269753, 3.0786997615803817, 1.2639432901907357], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 4.132231404958678, 3.95467458677686, 2.7077414772727275], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 29.11603009259259, 19.02488425925926], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 2652.0, 2652, 2652, 2652.0, 2652.0, 2652.0, 0.3770739064856712, 0.655828737745098, 0.17122985011312217], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 5998.0, 5998, 5998, 5998.0, 5998.0, 5998.0, 0.16672224074691563, 0.17893334236412137, 0.07456912720906969], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 1.440922190201729, 9.301265309798271, 0.6669893731988473], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 5444.0, 5444, 5444, 5444.0, 5444.0, 5444.0, 0.1836884643644379, 0.1641356883725202, 0.1000958624173402], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 1.4285714285714286, 1.6294642857142858, 0.6431361607142858], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 1.2135922330097086, 1.410326911407767, 0.5510941292475728], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 10410.0, 10410, 10410, 10410.0, 10410.0, 10410.0, 0.09606147934678194, 2.0789242615273773, 0.6693346241594621], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 9.615384615384617, 8.638822115384615, 4.291240985576923], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 3.9840637450199203, 25.717442729083665, 1.8441857569721116], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 1.5772870662460567, 3.294743197949527, 1.6481417586750788], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 1.176470588235294, 4.431295955882353, 2.4505974264705883], "isController": true}]}, function(index, item){
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
