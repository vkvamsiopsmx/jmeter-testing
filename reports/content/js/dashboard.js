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

    var data = {"OkPercent": 40.21739130434783, "KoPercent": 59.78260869565217};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3737864077669903, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-69"], "isController": false}, {"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-129"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-75"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/defaultLogTemplate-109"], "isController": false}, {"data": [1.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-79"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-55"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-71"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-128"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/endpointType-101"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application-127"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-330"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-331"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-111"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-95"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/pipelineTemplates-108"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/datasources-97"], "isController": false}, {"data": [0.0, 500, 1500, "\/auth\/user-91"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases\/newRelease-329"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/endpointType-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-70"], "isController": false}, {"data": [0.0, 500, 1500, "\/login-89"], "isController": false}, {"data": [1.0, 500, 1500, "DataSource-Delete"], "isController": true}, {"data": [1.0, 500, 1500, "DataSouce create and save"], "isController": true}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-105"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-113"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-93"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-102"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-51"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/policy\/list-54"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-134"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-136"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-137"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-65"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/policy\/list-100"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-106"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-133"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-47"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-46"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-52"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/audit\/pipelineconfig-53"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/17\/releases-332"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-40"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/applications-96"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-94"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/getClusterTags-110"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-39"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-44"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getDockerAccounts-107"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-68"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/14-130"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/dynamicMenu-63"], "isController": false}, {"data": [0.0, 500, 1500, "login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/login-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-48-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/user2\/applications-48"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/installation\/installationmode-64"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/users\/\/usergroups\/refresh-92"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-77"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/saveAccount-76"], "isController": false}, {"data": [1.0, 500, 1500, "\/dashboardservice\/v1\/datasources-51"], "isController": false}, {"data": [0.5, 500, 1500, "\/login-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-49"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/17-321"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-50"], "isController": false}, {"data": [0.0, 500, 1500, "Login and Loading"], "isController": true}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-78"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-43"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/application\/36-42"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-74"], "isController": false}, {"data": [1.0, 500, 1500, "\/oes\/dashboard\/widgetRawData-66"], "isController": false}, {"data": [1.0, 500, 1500, "\/auth\/user-61"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/applications-67"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/usergroups-103"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/appOnboarding\/images-126"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/dashboard\/\/applications-45"], "isController": false}, {"data": [1.0, 500, 1500, "\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/dashboard\/applications\/jmetertest\/releases-328"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelinescount-98"], "isController": false}, {"data": [0.0, 500, 1500, "\/dashboardservice\/v1\/applications\/jmetertest"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/audit\/pipelineconfig-99"], "isController": false}, {"data": [0.0, 500, 1500, "\/platformservice\/v1\/permissions-104"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-132"], "isController": false}, {"data": [0.0, 500, 1500, "\/autopilot\/api\/v1\/credentials-135"], "isController": false}, {"data": [0.0, 500, 1500, "\/oes\/accountsConfig\/getAccounts-325"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92, 55, 59.78260869565217, 361.8586956521739, 1, 15276, 21.0, 198.20000000000002, 297.94999999999993, 15276.0, 1.762958704608604, 1.430308038708441, 0.819781037414966], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, 100.0, 15276.0, 15276, 15276, 15276.0, 15276.0, 15276.0, 15276.0, 0.06546216286986123, 0.07345314954831107, 0.03049360516496465], "isController": false}, {"data": ["", 7, 7, 100.0, 127.85714285714285, 9, 432, 88.0, 432.0, 432.0, 432.0, 4.827586206896552, 15.247844827586208, 16.280307112068964], "isController": true}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 45.3125], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-75", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 13.125662076271187, 8.077330508474576], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.634548611111114], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-79", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 14.080255681818182, 8.629261363636363], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, 100.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 15.15480324074074, 15.625], "isController": false}, {"data": ["\/oes\/policy\/endpointType-55", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 11.460248161764705, 6.835937499999999], "isController": false}, {"data": ["\/oes\/policy\/list-71", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 18.490998641304348, 9.93546195652174], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 104.7092013888889], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 204.58984375, 204.1015625], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 48.046875], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 26.212993421052634], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-1", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 51.3599537037037, 16.710069444444443], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 33.25452302631579], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50-0", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 20.0439453125, 13.037109375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.09201388888889], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, 100.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 14.613560267857142, 14.718191964285714], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 53.5888671875], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 24.06939338235294, 24.471507352941174], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 81.8359375, 78.90625], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 44.23828125], "isController": false}, {"data": ["\/oes\/policy\/endpointType-72", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 11.807528409090908, 7.043087121212121], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-70", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 39.31419136597938, 2.481676868556701], "isController": false}, {"data": ["\/login-89", 1, 1, 100.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 2.223802649456522, 3.0305281929347827], "isController": false}, {"data": ["DataSource-Delete", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 24.947765261627907, 10.214162427325583], "isController": true}, {"data": ["DataSouce create and save", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 8.848576004155126, 5.9594658933518], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.09201388888889], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 42.1875], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 24.088541666666668], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 19.99627976190476], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-47", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 8.316200657894736, 5.160361842105263], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 52.490234375], "isController": false}, {"data": ["\/oes\/accountsConfig\/deleteAccount\/?accountName=Jmeter-test-50", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 25.447401889534884, 11.309956395348838], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 22.732204861111114, 23.328993055555557], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-46", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 14.20342167721519, 5.908821202531645], "isController": false}, {"data": ["\/oes\/policy\/list-54", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 5.1240116716867465, 2.753200301204819], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 47.74305555555556], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, 100.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 15.737680288461538, 16.188401442307693], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 19.76376488095238], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-65", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 4.66844512195122, 1.9888528963414633], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, 100.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 58.45424107142857, 57.198660714285715], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.203947368421055], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 52.978515625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 38.35227272727273], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 81.8359375, 83.984375], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, 100.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 25.0, 40.0, 16.3671875, 16.875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 24.44812863372093, 9.118368459302326], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, 100.0, 13063.0, 13063, 13063, 13063.0, 13063.0, 13063.0, 13063.0, 0.0765520936997627, 0.08193466278802725, 0.035659520209752736], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-53", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 26.13642444349315, 1.648785316780822], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.71792763157895], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.203947368421055], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 34.098307291666664, 36.62109375], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 24.06939338235294, 25.103400735294116], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 20.228794642857142], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 40.91796875, 41.9921875], "isController": false}, {"data": ["\/auth\/user-44", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 24.8046875, 11.279296875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 31.475360576923077, 33.05288461538462], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-68", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 23.82525275735294, 6.950827205882352], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.56373355263158], "isController": false}, {"data": ["\/oes\/dashboard\/dynamicMenu-63", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 22.00137867647059, 9.152879901960786], "isController": false}, {"data": ["login and Loading", 1, 1, 100.0, 15031.0, 15031, 15031, 15031.0, 15031.0, 15031.0, 15031.0, 0.06652917304237908, 1.3024514960747788, 0.4174315789035992], "isController": true}, {"data": ["\/login-59", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 2.487231998381877, 1.8014259708737865], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-0", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 23.860677083333336, 13.4765625], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-48-1", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 35.55689102564103, 9.740584935897436], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/user2\/applications-48", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 5.417158018867925, 2.307819870283019], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-45", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 8.765530873493976, 6.530026355421686], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-64", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 20.257411858974358, 12.570112179487179], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 136.39322916666666, 159.83072916666666], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-77", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 4.189453125, 3.33984375], "isController": false}, {"data": ["\/oes\/accountsConfig\/saveAccount-76", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 22.999730603448274, 18.352640086206897], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-51", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 13.847155448717947, 4.0397970085470085], "isController": false}, {"data": ["\/login-42", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 1.4828580097087378, 1.0713743932038835], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-49", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 4.384053111587982, 2.011802575107296], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.923519736842106], "isController": false}, {"data": ["\/platformservice\/v1\/applications-50", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 15.581916360294116, 6.950827205882352], "isController": false}, {"data": ["Login and Loading", 1, 1, 100.0, 16696.0, 16696, 16696, 16696.0, 16696.0, 16696.0, 16696.0, 0.059894585529468136, 1.2684316228437948, 0.433299892189746], "isController": true}, {"data": ["\/oes\/accountsConfig\/getAccounts-78", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 11.883624188311689, 6.189123376623376], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 34.098307291666664, 43.212890625], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 23.54029605263158], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-74", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 8.238447473404255, 5.090591755319149], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-66", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 13.095953525641026, 6.009615384615385], "isController": false}, {"data": ["\/auth\/user-61", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 36.74768518518518, 16.710069444444443], "isController": false}, {"data": ["\/platformservice\/v1\/applications-67", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 15.814482276119403, 7.054570895522388], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 37.198153409090914, 37.64204545454545], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 49.04513888888889], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 34.098307291666664, 36.1328125], "isController": false}, {"data": ["\/platformservice\/v1\/users\/user2\/usergroups\/refresh-62", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 9.57288240131579, 7.131476151315789], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.71792763157895], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 45.46440972222223], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 21.53577302631579, 22.56373355263158], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 53.1005859375], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 81.8359375, 83.0078125], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 422.8515625, 0.0], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 45.46440972222223, 46.875], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 51.1474609375, 51.6357421875], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 19.484747023809522, 19.76376488095238], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400\/Bad Request", 53, 96.36363636363636, 57.608695652173914], "isController": false}, {"data": ["500", 2, 3.6363636363636362, 2.1739130434782608], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 92, 55, "400\/Bad Request", 53, "500", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\/oes\/audit\/pipelinescount-69", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-129", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/defaultLogTemplate-109", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-53", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-128", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/policy\/endpointType-101", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application-127", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-330", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-331", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-111", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/widgetRawData-95", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/pipelineTemplates-108", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/datasources-97", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/auth\/user-91", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases\/newRelease-329", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/login-89", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-105", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-113", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/installation\/installationmode-93", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-54", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-102", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-51", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-134", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-136", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-137", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/policy\/list-100", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-106", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-133", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-49", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-47", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-46", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-52", 1, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/17\/releases-332", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-40", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/applications-96", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-94", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/getClusterTags-110", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-39", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/accountsConfig\/getDockerAccounts-107", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/14-130", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/users\/\/usergroups\/refresh-92", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/17-321", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-43", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/application\/36-42", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/platformservice\/v1\/usergroups-103", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/appOnboarding\/images-126", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/dashboard\/\/applications-45", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/oes\/dashboard\/applications\/jmetertest\/releases-328", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelinescount-98", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/dashboardservice\/v1\/applications\/jmetertest", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/audit\/pipelineconfig-99", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/platformservice\/v1\/permissions-104", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-132", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/autopilot\/api\/v1\/credentials-135", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\/oes\/accountsConfig\/getAccounts-325", 1, 1, "400\/Bad Request", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
