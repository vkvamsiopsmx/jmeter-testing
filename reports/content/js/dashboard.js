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

    var data = {"OkPercent": 39.130434782608695, "KoPercent": 60.869565217391305};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35436893203883496, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-129"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/defaultLogTemplate-109"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-128"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-101"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-127"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-330"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-331"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-111"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-95"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/pipelineTemplates-108"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-97"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-91"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-329"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-89"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [0.0, 500, 1500, "DataSouce create and save"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-105"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-113"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-93"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-102"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-134"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-136"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-137"], "isController": false}, {"data": [0.5, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-100"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-106"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-133"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases-332"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-40"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/applications-96"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-94"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/getClusterTags-110"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-39"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-107"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-130"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/usergroups\/refresh-92"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/17-321"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-43"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/usergroups-103"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/images-126"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/jmetertest\/releases-328"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-98"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/jmetertest"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-99"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/permissions-104"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-132"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-135"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-325"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 56, 60.869565217391305, 61.63043478260872, 1, 668, 35.5, 90.7, 311.84999999999957, 668.0, 2.3637624932555688, 1.6006230971069604, 1.099156584812826], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 14.776932565789474, 6.129214638157895], "isController": false}, {"data": ["", 7, 7, 100.0, 243.7142857142857, 19, 893, 173.0, 893.0, 893.0, 893.0, 2.37449118046133, 7.499456729138399, 8.007613742367708], "isController": true}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 23.848684210526315], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 10.057325487012987, 6.189123376623376], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, 100.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 15.15480324074074, 15.87818287037037], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 13.828822544642858, 8.475167410714285], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, 100.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 10.2294921875, 10.546875], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 13.916015625, 8.30078125], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 12.32733242753623, 6.623641304347825], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, 100.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 11.366102430555557, 26.177300347222225], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, 100.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 32.0, 31.25, 12.786865234375, 12.75634765625], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, 100.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 20.458984375, 24.0234375], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 45.27698863636364], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 37.47888513513514, 12.19383445945946], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, 100.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 15.737680288461538, 24.301382211538463], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 42.19777960526316, 27.44654605263158], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, 100.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 11.058910472972974, 11.45481418918919], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, 100.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 20.458984375, 20.60546875], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 142.90364583333334], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, 100.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 11.058910472972974, 11.24366554054054], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 24.06939338235294, 23.207720588235293], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 21.06584821428571], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 20.5078125, 12.232730263157896], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 27.794471153846153, 12.344751602564102], "isController": false}, {"data": ["\/login-89", 1, 1, 100.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.9515806686046512, 1.2967841569767442], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 25.541759672619047, 10.457356770833332], "isController": true}, {"data": ["DataSouce create and save", 1, 1, 100.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 15.57639281674208, 9.734693156108596], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 141.27604166666666], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 23.4375], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, 100.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 17.049153645833332, 18.06640625], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, 100.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 20.458984375, 20.99609375], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 16.123246173469386, 10.004783163265305], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, 100.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 14.109644396551724, 14.480064655172413], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 37.732354525862064, 16.769935344827584], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.017348345588235, 6.17532169117647], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 20.036969866071427, 8.335658482142858], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 21.2646484375, 11.42578125], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, 100.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 10.767886513157896, 11.307565789473685], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.26349431818182], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 21.844161184210527], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 1.8551763660179639, 0.732421875], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 18.599076704545457, 18.199573863636363], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, 100.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.3671875, 16.875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, 100.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 20.458984375, 21.19140625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, 100.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 10.767886513157896, 11.101973684210527], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, 100.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 10.49178685897436, 10.767227564102564], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, 100.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 10.767886513157896, 11.101973684210527], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 19.113991477272727, 7.12890625], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 12.42404513888889, 5.17578125], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 26.438643292682926, 11.742568597560975], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 20.554315476190474], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.35227272727273], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 23.129111842105264], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, 100.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 13.199344758064516, 13.766381048387096], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 27.278645833333336, 28.3203125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.174715909090914], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 38.16105769230769, 17.352764423076923], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 42.96875], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 20.49545094936709, 5.982990506329114], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 42.87109375], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 5.343191964285714, 2.222842261904762], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 1433.0, 1433, 1433, 1433.0, 1433.0, 1433.0, 1433.0, 0.6978367062107467, 9.236114139916259, 4.37851644277739], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 2.677890897212544, 1.9395143728222999], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 10.526769301470587, 5.9455422794117645], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 57.779947916666664, 15.828450520833332], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 2.764756944444444, 1.0872395833333333], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 9.327423878205128, 6.948617788461538], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 22.572544642857142, 14.006696428571427], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 29.227120535714285, 34.249441964285715], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 12.482040229885058, 7.6778017241379315], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 23.821149553571427, 19.008091517857142], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 36.79865056818182, 10.7421875], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 2.1331616620111733, 1.5412229399441342], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 13.095953525641026, 6.009615384615385], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, 100.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 8.895210597826088, 9.468410326086957], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 16.761893656716417, 7.054570895522388], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 1994.0, 1994, 1994, 1994.0, 1994.0, 1994.0, 1994.0, 0.5015045135406219, 7.487305667001003, 3.6280717151454365], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 18.30078125, 9.53125], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, 100.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 10.767886513157896, 13.646175986842106], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, 100.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 11.366102430555557, 12.42404513888889], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 11.731270032051283, 6.134815705128205], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 11.74119971264368, 5.387931034482759], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 32.006048387096776, 14.553931451612904], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.34117445054945, 5.194024725274725], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 18.599076704545457, 18.821022727272727], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 23.231907894736842], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 43.359375], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 5.63983769379845, 4.201489825581395], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 23.980034722222225], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, 100.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 20.458984375, 20.458984375], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, 100.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 20.458984375, 21.435546875], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, 100.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 14.613560267857142, 15.171595982142858], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 41.50390625], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 421.875, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 20.08928571428571], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 21.74136513157895], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, 100.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.017348345588235, 6.103515625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400\/Bad Request", 53, 94.64285714285714, 57.608695652173914], "isController": false}, {"data": ["422", 1, 1.7857142857142858, 1.0869565217391304], "isController": false}, {"data": ["500", 2, 3.5714285714285716, 2.1739130434782608], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 92, 56, "400\/Bad Request", 53, "500", 2, "422", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-89", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 1, "422", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
