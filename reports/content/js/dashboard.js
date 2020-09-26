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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8289473684210527, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.5, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 440.94117647058823, 18, 3918, 1823.5, 3372.0, 3918.0, 1.1812528228468193, 1.6019316415071396, 0.5607693777577042], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 3918.0, 3918, 3918, 3918.0, 3918.0, 3918.0, 0.25523226135783567, 0.2739260305002552, 0.1141566168963757], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 18.18181818181818, 16.530539772727273, 8.575994318181818], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 7.462686567164179, 8.293493470149253, 3.2284864738805967], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 16.666666666666668, 14.892578125, 7.633463541666667], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 9.00900900900901, 10.179124436936936, 4.126196509009009], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 15.384615384615385, 13.746995192307692, 7.016225961538462], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 15.151515151515152, 15.758167613636363, 6.969105113636363], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 13.110632183908047, 5.174658764367816], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 38.46153846153847, 34.55528846153846, 17.164963942307693], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 61.74045138888889, 24.034288194444446], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 21.27659574468085, 37.005485372340424, 9.661735372340425], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 1522.0, 1522, 1522, 1522.0, 1522.0, 1522.0, 0.657030223390276, 0.6846203597240473, 0.29835845105124836], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 10.204081632653061, 9.785554846938775, 5.929129464285714], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 29.385653409090907, 13.28716856060606], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 6.578947368421052, 8.165861430921053, 2.9489617598684212], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 23.65186737804878, 10.694550304878048], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 19.230769230769234, 16.28230168269231, 10.06610576923077], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 33.546241554054056, 12.114653716216218], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 6926.0, 6926, 6926, 6926.0, 6926.0, 6926.0, 0.14438348252959862, 2.7659870867022813, 0.872786871931851], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 1319.0, 1319, 1319, 1319.0, 1319.0, 1319.0, 0.7581501137225171, 0.6811504927975739, 0.41683448635329795], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 2.320185614849188, 2.777878480278422, 1.0921186194895591], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 5.88235294117647, 7.042738970588235, 2.7688419117647056], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 7.462686567164179, 6.318505130597014, 3.9062499999999996], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 32.470703125, 16.845703125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 12.5, 14.12353515625, 5.79833984375], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 5.555555555555555, 5.316840277777778, 3.640407986111111], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 20.0, 15.72265625, 10.2734375], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 4.25531914893617, 7.401097074468086, 1.9323470744680853], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 3190.0, 3190, 3190, 3190.0, 3190.0, 3190.0, 0.31347962382445144, 0.3364395572100313, 0.14020865987460815], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 13.888888888888888, 84.64898003472223, 6.429036458333334], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 2125.0, 2125, 2125, 2125.0, 2125.0, 2125.0, 0.47058823529411764, 0.42049632352941174, 0.25643382352941174], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 4.830917874396135, 5.510265700483092, 2.174856582125604], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 8.130081300813009, 8.471481199186991, 3.6918826219512195], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 7483.0, 7483, 7483, 7483.0, 7483.0, 7483.0, 0.13363624214887077, 2.81915049111319, 0.9311470583322198], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 23.036858974358974, 11.443309294871796], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 70.0543283045977, 5.320581896551724], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 5.617977528089887, 11.735208918539326, 5.870347612359551], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 2.4630541871921183, 9.27734375, 5.13056111453202], "isController": true}]}, function(index, item){
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
