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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8026315789473685, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.5, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.5, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 649.529411764706, 42, 7185, 191.5, 1982.0, 4838.25, 7185.0, 1.0418262601501456, 1.3178132660487207, 0.512175386854604], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 4056.0, 4056, 4056, 4056.0, 4056.0, 4056.0, 4056.0, 0.2465483234714004, 0.23547291050295857, 0.11484721708579881], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 6.475730020491803, 4.018314549180328], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 2.6067708333333335, 1.203125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 1.2592098577235773, 0.7748983739837398], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 6.985031011450381, 3.637881679389313], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 10.099712171052632, 6.167763157894737], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 5.197409815436242, 3.1852978187919465], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 2.3538421352583585, 1.4544547872340425], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 5.491851478494624, 2.5201612903225805], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 6.136195866141732, 3.6601870078740157], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 14.590135261194028, 6.733908582089552], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 9.012744413407821, 2.640537709497207], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 18.438430059523807, 11.253720238095237], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 12.32733242753623, 6.623641304347825], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 5.724848533163265, 2.3816167091836733], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 1.978106831395349, 1.0628633720930232], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 6.9289434523809526, 5.161830357142858], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 13.200827205882351, 5.49172794117647], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 14696.0, 14696, 14696, 14696.0, 14696.0, 14696.0, 14696.0, 0.06804572672836147, 1.247217036098258, 0.42694706467746324], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 3.8620838567839195, 2.7971890703517586], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 4.033406575520833, 2.5482177734375], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 7.4462890625, 4.704402043269231], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 2.2806867163009406, 1.6990350705329154], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 16.459147135416668, 10.213216145833334], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 2.216641865079365, 1.7671130952380951], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 8.662236201298702, 6.912033279220779], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 2785.0, 2785, 2785, 2785.0, 2785.0, 2785.0, 2785.0, 0.3590664272890485, 0.5792751346499102, 0.1697149910233393], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 7185.0, 7185, 7185, 7185.0, 7185.0, 7185.0, 7185.0, 0.13917884481558804, 0.1329266701461378, 0.06483233298538622], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 22.938298722044728, 1.5381639376996805], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 844.0, 844, 844, 844.0, 844.0, 844.0, 844.0, 1.1848341232227488, 0.9048244964454977, 0.6537414840047393], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 1179.0, 1179, 1179, 1179.0, 1179.0, 1179.0, 1179.0, 0.8481764206955047, 0.8663989609838846, 0.3975826972010178], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 1.2311829292527823, 0.7514407790143084], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 6386.0, 6386, 6386, 6386.0, 6386.0, 6386.0, 6386.0, 0.15659254619480115, 3.113500234888819, 1.1328492013780145], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 11.29415760869565, 6.736865942028985], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 30.814109442060083, 2.0662888948497855], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 4.361297447643979, 3.067735602094241], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 5.99470388576779, 3.950140449438202], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 4.346035289115647, 2.92703018707483], "isController": true}]}, function(index, item){
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
