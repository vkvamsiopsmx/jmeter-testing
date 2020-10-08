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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6842105263157895, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.5, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [0.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [0.5, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.5, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.5, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 0, 0.0, 928.7352941176471, 83, 5993, 3119.5, 4246.25, 5993.0, 0.6997324552377032, 1.0146080404918707, 0.33217997530356036], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 0, 0.0, 3664.0, 3664, 3664, 3664.0, 3664.0, 3664.0, 0.2729257641921397, 0.2929154441866812, 0.1220703125], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 5.263157894736842, 4.78515625, 2.4825246710526314], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 2.304147465437788, 2.560663882488479, 0.9968137960829493], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 2.1186440677966103, 2.780720338983051, 0.9703555349576272], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 3.134796238244514, 3.545013714733542, 1.4357611677115987], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 1.4705882352941175, 1.9301470588235292, 0.6706686580882353], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 5.434782608695652, 5.652386209239131, 2.4997877038043477], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 3.4965034965034967, 3.988199300699301, 1.5741094842657344], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 5.617977528089887, 5.047401685393258, 2.5072419241573036], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 12.048192771084338, 13.38949548192771, 5.212255271084337], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 3.5971223021582737, 6.256323066546762, 1.6334588579136688], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 6.896551724137931, 8.519665948275863, 3.1317349137931036], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 4.032258064516129, 3.8668724798387095, 2.342962449596774], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 4.672897196261682, 4.531432535046729, 2.0489558995327104], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 6.756756756756757, 8.386560388513514, 3.0286634290540544], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 5.58659217877095, 5.417466829608939, 2.449589734636872], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 2.150537634408602, 1.8208165322580645, 1.1256720430107525], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 3.7593984962406015, 4.666206531954887, 1.6851210056390977], "isController": false}, {"data": ["login and Loading", 1, 0, 0.0, 18999.0, 18999, 18999, 18999.0, 18999.0, 18999.0, 0.05263434917627243, 1.0702146330070004, 0.3181705287120375], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 2291.0, 2291, 2291, 2291.0, 2291.0, 2291.0, 0.43649061545176776, 0.3921595373199476, 0.23998458642514187], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 3058.0, 3058, 3058, 3058.0, 3058.0, 3058.0, 0.3270111183780249, 0.4569852640614781, 0.15392515533028123], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 1384.0, 1384, 1384, 1384.0, 1384.0, 1384.0, 0.722543352601156, 1.0097261109104048, 0.34010341401734107], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 2.109704641350211, 1.7862440664556962, 1.104298523206751], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 9.25925925925926, 8.418330439814815, 4.367404513888889], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 3.289473684210526, 3.7199321546052633, 1.52587890625], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 2.544529262086514, 2.435194020356234, 1.6673624363867683], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 6.0606060606060606, 4.764441287878788, 3.1131628787878785], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 2724.0, 2724, 2724, 2724.0, 2724.0, 2724.0, 0.36710719530102787, 0.638494057452276, 0.16670395099118943], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 0, 0.0, 5993.0, 5993, 5993, 5993.0, 5993.0, 5993.0, 0.1668613382279326, 0.17908262764892374, 0.07463134073085266], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 1.297016861219196, 8.91952415693904, 0.6003769455252919], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 3181.0, 3181, 3181, 3181.0, 3181.0, 3181.0, 0.3143665513989311, 0.2809037055957246, 0.17130521062558943], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 1.5797788309636651, 1.8019352290679305, 0.7112090244865719], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 1.1924242881274132, 0.4383219715250965], "isController": false}, {"data": ["Login and Loading", 1, 0, 0.0, 10469.0, 10469, 10469, 10469.0, 10469.0, 10469.0, 0.09552010698251981, 2.167392271229344, 0.6655624641799599], "isController": true}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 4.065040650406504, 3.6521849593495936, 1.814183180894309], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 2.6109660574412534, 17.955491187989555, 1.2085917101827677], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 1.8115942028985508, 3.7859488224637676, 1.8929744112318838], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 1557.0, 1557, 1557, 1557.0, 1557.0, 1557.0, 0.6422607578676942, 2.688839715799615, 1.337834176300578], "isController": true}]}, function(index, item){
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
