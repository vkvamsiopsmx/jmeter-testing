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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6842105263157895, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.5, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.5, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.5, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 853.7941176470588, 68, 5578, 2406.5, 4532.5, 5578.0, 0.6836781886549637, 0.9307496204580643, 0.32455862540467717], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 1913.0, 1913, 1913, 1913.0, 1913.0, 1913.0, 0.5227391531625718, 0.5610257122320962, 0.23380325405122843], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 6.993006993006993, 6.357899912587413, 3.2984593531468533], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 1.0427528675703859, 1.1588405891553701, 0.4511128128258603], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 2.6246719160104988, 2.3452878937007875, 1.2021202427821522], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 5.4945054945054945, 6.251073145604396, 2.5165264423076925], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 2.617801047120419, 2.3391483965968587, 1.1938604384816753], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 1.9230769230769231, 2.1615835336538463, 0.8845402644230769], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 6.369426751592357, 7.265127388535032, 2.867486066878981], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 6.211180124223602, 5.580357142857142, 2.771981754658385], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 5.208333333333333, 5.788167317708333, 2.2532145182291665], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 6.944444444444444, 12.044270833333334, 3.153483072916667], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 2.1186440677966103, 2.4062334480932206, 0.9620795815677967], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 3.4965034965034967, 3.3530922202797204, 2.0316597465034967], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 14.705882352941176, 14.96438419117647, 6.448184742647058], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 5.263157894736842, 6.532689144736842, 2.3591694078947367], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 2.5706940874035986, 2.61588206940874, 1.1271891066838047], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 1.2820512820512822, 1.0854867788461537, 0.671073717948718], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 7.8125, 9.69696044921875, 3.50189208984375], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 19040.0, 19040, 19040, 19040.0, 19040.0, 19040.0, 0.052521008403361345, 1.0083623293067228, 0.31748539259453784], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 2019.0, 2019, 2019, 2019.0, 2019.0, 2019.0, 0.49529470034670625, 0.4449913323427439, 0.272315347944527], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 2359.0, 2359, 2359, 2359.0, 2359.0, 2359.0, 0.42390843577787196, 0.5220200561678677, 0.19953502543450616], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 931.0, 931, 931, 931.0, 931.0, 931.0, 1.0741138560687433, 1.3227124731471536, 0.5055887486573577], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 3.048780487804878, 2.5813405106707314, 1.5958460365853657], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 4.672897196261682, 4.248503212616822, 2.2041106892523366], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 3.8610038610038613, 4.392645994208494, 1.7909930019305018], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 2.7027027027027026, 2.586570945945946, 1.7710092905405406], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 8.0, 6.2890625, 4.109375], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 2454.0, 2454, 2454, 2454.0, 2454.0, 2454.0, 0.40749796251018744, 0.7087440148736756, 0.18504546149144252], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 4184.0, 4184, 4184, 4184.0, 4184.0, 4184.0, 0.2390057361376673, 0.25651103907743783, 0.10689904995219884], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 2.1186440677966103, 12.629104872881356, 0.9807004766949153], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 5578.0, 5578, 5578, 5578.0, 5578.0, 5578.0, 0.1792757260666906, 0.16019266538185728, 0.0976912647902474], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 889.0, 889, 889, 889.0, 889.0, 889.0, 1.124859392575928, 1.283042744656918, 0.5064064257592801], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 1.0706638115631693, 1.2159980594218416, 0.48619010974304067], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 8385.0, 8385, 8385, 8385.0, 8385.0, 8385.0, 0.11926058437686345, 2.5303275939177103, 0.8309807319618366], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 5.46448087431694, 4.9094945355191255, 2.4387380464480874], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 3.5335689045936394, 21.06338339222615, 1.6356559187279154], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 1.834862385321101, 3.8471186926605503, 1.9172878440366972], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 3.5641303706326726, 1.9669573300283287], "isController": true}]}, function(index, item){
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
