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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8421052631578947, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.5, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.5, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 449.9411764705881, 43, 4517, 1387.0, 2331.5, 4517.0, 1.4001564880780792, 2.0333154882016222, 0.6646882592760367], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 4517.0, 4517, 4517, 4517.0, 4517.0, 4517.0, 0.22138587558113793, 0.23760066139030328, 0.09901829200796988], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 13.157894736842104, 11.962890625, 6.206311677631579], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 12.773886494252874, 4.972611350574713], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 4.807692307692308, 6.342961237980769, 2.201960637019231], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 11.627906976744185, 13.149527616279071, 5.325672238372094], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 9.25925925925926, 12.21607349537037, 4.222728587962963], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 5.235602094240838, 5.445230693717277, 2.408172447643979], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 4.504504504504505, 5.13795045045045, 2.027906813063063], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 13.822115384615385, 6.865985576923077], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 23.25581395348837, 25.844840116279073, 10.060864825581396], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 6.756756756756757, 11.751741976351353, 3.068253800675676], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 2.857142857142857, 3.45703125, 1.2974330357142858], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 6.211180124223602, 5.956424689440993, 3.6090353260869565], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 11.11111111111111, 10.774739583333334, 4.871961805555555], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 11.627906976744185, 14.432685319767444, 5.212118459302326], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 3.7593984962406015, 3.6455885808270674, 1.648408129699248], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 7.194244604316547, 6.091220773381295, 3.7657374100719423], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 14.084507042253522, 17.481844190140848, 6.313270246478874], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 5189.0, 5189, 5189, 5189.0, 5189.0, 5189.0, 0.1927153594141453, 3.9239406677587203, 1.1649492917710542], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 1498.0, 1498, 1498, 1498.0, 1498.0, 1498.0, 0.6675567423230975, 0.5997580106809078, 0.3670258261014686], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 908.0, 908, 908, 908.0, 908.0, 908.0, 1.1013215859030838, 1.5003355589207048, 0.5183955121145374], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1276.0, 1276, 1276, 1276.0, 1276.0, 1276.0, 0.7836990595611285, 1.0714635579937304, 0.3688895963949843], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 7.194244604316547, 6.091220773381295, 3.7657374100719423], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 9.433962264150942, 8.577166863207548, 4.44980837264151], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 13.513513513513514, 15.281883445945947, 6.268475506756757], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 4.651162790697675, 4.451308139534884, 3.0477834302325584], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 15.873015873015872, 12.47829861111111, 8.153521825396826], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 6.369426751592357, 11.078075238853502, 2.8923666401273884], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 1603.0, 1603, 1603, 1603.0, 1603.0, 1603.0, 0.6238303181534622, 0.6695210152838428, 0.27901785714285715], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 3.3112582781456954, 23.06563017384106, 1.5327504139072847], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 1232.0, 1232, 1232, 1232.0, 1232.0, 1232.0, 0.8116883116883118, 0.725287895698052, 0.4423067167207792], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 9.803921568627452, 11.182598039215687, 4.413679534313726], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 6.024096385542169, 7.288921310240964, 2.735551581325301], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 9402.0, 9402, 9402, 9402.0, 9402.0, 9402.0, 0.10636034886194426, 2.417620586045522, 0.7410948136034887], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 7.8125, 7.01904296875, 3.48663330078125], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 2.4096385542168677, 16.78510918674699, 1.1153990963855422], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 4.25531914893617, 8.892952127659575, 4.446476063829787], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 2.1186440677966103, 8.884235963983052, 4.4131521451271185], "isController": true}]}, function(index, item){
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
