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

    var data = {"OkPercent": 82.3529411764706, "KoPercent": 17.647058823529413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.618421052631579, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.5, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.5, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 6, 17.647058823529413, 886.8529411764707, 27, 7718, 1803.5, 4813.25, 7718.0, 0.8646998982706002, 1.2302154199516786, 0.410494023397762], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 3845.0, 3845, 3845, 3845.0, 3845.0, 3845.0, 0.2600780234070221, 0.2791267067620286, 0.11632395968790636], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, 100.0, 1273.0, 1273, 1273, 1273.0, 1273.0, 1273.0, 0.7855459544383347, 0.8660951001571092, 0.370526070306363], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 7.936507936507936, 8.820064484126984, 3.433469742063492], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 1.2411438734713076, 0.43086341721542804], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 1.2738853503184713, 1.4567575636942676, 0.5834494426751592], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 2.5839793281653747, 3.4091367894056845, 1.17843588501292], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 2.506265664160401, 2.834234022556391, 1.1527843045112782], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 3.4482758620689653, 3.933189655172414, 1.552397629310345], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 8.849557522123893, 7.950774336283185, 3.9494607300884956], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 41.160300925925924, 16.022858796296298], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 1120.0, 1120, 1120, 1120.0, 1120.0, 1120.0, 0.8928571428571428, 0.9835379464285713, 0.40544782366071425], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 3.8910505836575875, 4.936010457198443, 1.7669321498054473], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 3.663003663003663, 3.5127632783882783, 2.1284054487179485], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 9.615384615384617, 9.324293870192308, 4.216120793269231], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 5.780346820809248, 7.174629696531793, 2.5909953034682083], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 3.5335689045936394, 3.426595627208481, 1.5493871466431097], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 3.4129692832764507, 2.8896917662116044, 1.7864761092150172], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 11.904761904761903, 14.776320684523808, 5.336216517857142], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 16019.0, 16019, 16019, 16019.0, 16019.0, 16019.0, 0.06242586928022972, 1.2363248330107999, 0.3773595027779512], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 1671.0, 1671, 1671, 1671.0, 1671.0, 1671.0, 0.5984440454817475, 0.5376645721125075, 0.3290273414123279], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 1203.0, 1203, 1203, 1203.0, 1203.0, 1203.0, 0.8312551953449709, 0.9156795511221945, 0.3912744181213632], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 1222.0, 1222, 1222, 1222.0, 1222.0, 1222.0, 0.8183306055646482, 0.8974465527823241, 0.38519077332242224], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 6.211180124223602, 5.258880046583851, 3.251164596273292], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, 100.0, 1250.0, 1250, 1250, 1250.0, 1250.0, 1250.0, 0.8, 0.88203125, 0.37734375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 2.9069767441860463, 3.324286882267442, 1.3484511264534884], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 3.484320557491289, 3.3346036585365857, 2.2831827090592336], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 19.173971036585364, 12.52858231707317], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 1357.0, 1357, 1357, 1357.0, 1357.0, 1357.0, 0.7369196757553427, 0.8088844878408253, 0.3346363761974945], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 7718.0, 7718, 7718, 7718.0, 7718.0, 7718.0, 0.1295672454003628, 0.13905703388183469, 0.057950974993521635], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 2.9585798816568047, 20.886302699704142, 1.3694988905325443], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 1936.0, 1936, 1936, 1936.0, 1936.0, 1936.0, 0.5165289256198348, 0.4615468427169422, 0.28146791064049587], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 2.544529262086514, 2.90235368956743, 1.1455351463104326], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 945.0, 945, 945, 945.0, 945.0, 945.0, 1.0582010582010584, 1.3423859126984128, 0.480530753968254], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 12017.0, 12017, 12017, 12017.0, 12017.0, 12017.0, 0.08321544478655238, 1.8522750322459849, 0.5798263657734876], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 9.174311926605505, 8.242545871559633, 4.09439506880734], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 3.5335689045936394, 24.945478136042404, 1.6356559187279154], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 1.6207455429497568, 3.4076808144246353, 1.693552471636953], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 1500.0, 1500, 1500, 1500.0, 1500.0, 1500.0, 0.6666666666666666, 2.8040364583333335, 1.388671875], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 6, 100.0, 17.647058823529413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 6, "500", 6, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
