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

    var data = {"OkPercent": 38.23529411764706, "KoPercent": 61.76470588235294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.34210526315789475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-58"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57"], "isController": false}, {"data": [0.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 21, 61.76470588235294, 782.9411764705881, 42, 1618, 1126.0, 1190.5, 1450.0, 1618.0, 0.9794601446144096, 1.0648984620315156, 0.4815153904877135], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 1195.0, 1195, 1195, 1195.0, 1195.0, 1195.0, 1195.0, 0.8368200836820083, 0.8196587343096234, 0.38980779288702927], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 18.810453869047617, 11.672247023809524], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 6.109619140625, 2.81982421875], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 7.040127840909091, 4.332386363636363], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, 100.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.836457888556789, 0.4069705380017079], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, 100.0, 1098.0, 1098, 1098, 1098.0, 1098.0, 1098.0, 1098.0, 0.9107468123861566, 0.8858435792349726, 0.4269125683060109], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 6.097748523622047, 3.7370816929133857], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, 100.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 0.8407658261802575, 0.41074302575107297], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, 100.0, 1153.0, 1153, 1153, 1153.0, 1153.0, 1153.0, 1153.0, 0.8673026886383347, 0.8495162077189939, 0.4065481352992194], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, 100.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 0.8637497244268079, 0.40991512345679015], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 21.25084918478261, 9.808084239130435], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, 100.0, 1136.0, 1136, 1136, 1136.0, 1136.0, 1136.0, 1136.0, 0.8802816901408451, 0.9842993507922536, 0.41607064260563387], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 34.044630984042556, 5.0282579787234045], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, 100.0, 1167.0, 1167, 1167, 1167.0, 1167.0, 1167.0, 1167.0, 0.8568980291345331, 0.8393249250214224, 0.39162917737789205], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, 100.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.836457888556789, 0.3986309777967549], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, 100.0, 1143.0, 1143, 1143, 1143.0, 1143.0, 1143.0, 1143.0, 0.8748906386701663, 0.8560941601049868, 0.3998523622047244], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 5.867250504032258, 4.370904737903226], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, 100.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.8372918445772843, 0.3986309777967549], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 10372.0, 10372, 10372, 10372.0, 10372.0, 10372.0, 10372.0, 0.09641342074816814, 1.4396105500385654, 0.6049377229560355], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 4.045024671052632, 2.9296875], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, 100.0, 1394.0, 1394, 1394, 1394.0, 1394.0, 1394.0, 1394.0, 0.7173601147776184, 1.0599275914634148, 0.3509740405308465], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, 100.0, 1618.0, 1618, 1618, 1618.0, 1618.0, 1618.0, 1618.0, 0.6180469715698392, 0.9125849814585908, 0.30238430933250926], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 4.06446403631285, 3.0278893156424584], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 9.294577205882351, 5.767463235294117], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 1117.0, 1117, 1117, 1117.0, 1117.0, 1117.0, 1117.0, 0.8952551477170994, 0.8768954230080573, 0.5980024619516562], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 10.934298155737705, 8.725025614754099], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, 100.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 0.9765625000000001, 0.4124400087260035], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 1166.0, 1166, 1166, 1166.0, 1166.0, 1166.0, 1166.0, 0.8576329331046312, 0.8400447577186965, 0.39950284090909094], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, 100.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.836457888556789, 0.41114031810418444], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 2.3716517857142856, 1.7135335791925466], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, 100.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 0.8258787415682969, 0.39523608768971336], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 20.254400712025316, 2.991495253164557], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 11556.0, 11556, 11556, 11556.0, 11556.0, 11556.0, 11556.0, 0.08653513326410524, 1.4441395433108344, 0.6260276047075113], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, 100.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 0.8264490076013514, 0.3926045185810811], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, 100.0, 1118.0, 1118, 1118, 1118.0, 1118.0, 1118.0, 1118.0, 0.8944543828264758, 0.8752375894454382, 0.43063086985688726], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, 100.0, 1118.0, 1118, 1118, 1118.0, 1118.0, 1118.0, 1118.0, 0.8944543828264758, 0.8699966457960643, 0.5240943649373881], "isController": false}, {"data": ["DataSource-Delete", 1, 1, 100.0, 2216.0, 2216, 2216, 2216.0, 2216.0, 2216.0, 2216.0, 0.4512635379061372, 0.8778486010830324, 0.475942012635379], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 2476.0, 2476, 2476, 2476.0, 2476.0, 2476.0, 2476.0, 0.4038772213247173, 1.3733403170436187, 0.868888201736672], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 21, 100.0, 61.76470588235294], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 21, "500", 21, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-58", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-57", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
