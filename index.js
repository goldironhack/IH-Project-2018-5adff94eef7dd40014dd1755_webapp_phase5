/*----------------------------------------------------------Const URLS------------------------------------------------------*/
const CRIMES_DATA_SET = "https://data.cityofnewyork.us/api/views/uvyt-v4ny/rows.json";
const HOUSING_NY_DATASET = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json"; 
const NHOOD_NAMES_DATA_SET="https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json";
const NHOOD_GEOSHAPES_GEODATA='http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
/*----------------------------------------------------------globalVars------------------------------------------------------*/
var infoCr = [];
var infoNames = [];
var infoHousing = [];
var broughCrimes = [];
var nHoodDescription = [];
var housingDescription = [];
var districtDescription = [];
var controlNames = 0;
var controlHousing =0;
var controlCrimes = 0; 
var latNYU = 40.729100;
var longNYU = -73.996500;
var distriAr=[];
var distriCenters=[];
var map;

/*------------------------------------------------------functions-----------------------------------------------------------*/

function getDistrictsData(){
    var tableRef = $("#districtTable")[0];
    var brough,district;    
    for(var k = 0; k < districtDescription; k++){
            nRow = tableRef.insertRow(tableRef.rows.length);
            brough=nRow.insertCell(0);                
            district = nRow.insertCell(1); 
            dName.innerHTML = districtDescription[k].nboro;
            dis.innerHTML = districtDescription[k].ndis;
    }    
    console.log(districtDescription);   
}

function getCrimesData(URL){
    var data = $.get(CRIMES_DATA_SET, function(){})
        .done(function(){
            var dataCrimes = data.responseJSON.data;
            for(var i = 0; i < dataCrimes.length; i++){                
                    infoCr.push([dataCrimes[i][21]]);                                    
            }
            var tableRef = $("#tableSafe")[0];
            var brough;
            broughCrimes = [{name:"MANHATTAN",number:countCrimes("MANHATTAN")},
                           {name: "BRONX",number:countCrimes("BRONX")},
                           {name: "BROOKLYN",number:countCrimes("BROOKLYN")},
                           {name: "QUEENS",number:countCrimes("QUEENS")},
                           {name: "STATEN ISLAND",number:countCrimes("STATEN ISLAND")}];
            broughCrimes.sort(function(a, b){return a.number - b.number});            
            for(var k = 0; k < broughCrimes.length; k++){
                if(controlCrimes < 5){
                    nRow = tableRef.insertRow(tableRef.rows.length);
                    brough = nRow.insertCell(0);
                    description = nRow.insertCell(1); 
                    brough.innerHTML = broughCrimes[k].name;
                    description.innerHTML = broughCrimes[k].number;
                    controlCrimes++;
                }
            }
            
            console.log(broughCrimes);
        })
        .fail(function(error){
            console.log(error);
        })
}

function getNamesData(URL){
    var data = $.get(NHOOD_NAMES_DATA_SET, function(){})
        .done(function(){
            var dataNames = data.responseJSON.data;
            for(var i= 0; i < dataNames.length; i++){                
                    var distance = google.maps.geometry.spherical.computeDistanceBetween (new google.maps.LatLng(40.729100, -73.996500), new google.maps.LatLng( distriCenters[i].latD, distriCenters[i].longD ));
                    var tLat = parseFloat(dataNames[i][9].split(" ")[2].split(")")[0]);     
                    var tLong = parseFloat(dataNames[i][9].split(" ")[1].split("(")[1]);                
                    var desc = {name:dataNames[i][10] , dist: distance,lati:distriCenters[i].latD,longi:distriCenters[i].longD ,bro:dataNames[i][16],distri: distriAr[i]};
                    nHoodDescription.push(desc);           
            }
            var tableRef = $("#tableNear")[0];
            var dName, nLat , nLong, dis, ndis;
            nHoodDescription.sort(function(a, b){return a.dist - b.dist});           
            for(var k = 0; k < 9; k++){
                if(controlNames < 9){
                    nRow = tableRef.insertRow(tableRef.rows.length);
                    ndis=nRow.insertCell(0);                    
                    dName=nRow.insertCell(1);                
                    dis = nRow.insertCell(2);
                    nLat = nRow.insertCell(3);
                    nLong = nRow.insertCell(4); 
                    ndis.innerHTML = districtDescription[k].ndis;
                    dName.innerHTML = districtDescription[k].nbro;
                    dis.innerHTML = nHoodDescription[k].dist;                    
                    nLat.innerHTML = nHoodDescription[k].lati;
                    nLong.innerHTML = nHoodDescription[k].longi;
                    controlNames++;
                }
            }
            console.log();
        })
        .fail(function(error){
            console.log(error);
        })
}

function getCen(){
  for (var i = 0; i < distriAr.length; i++) {
    centerLatLong= new google.maps.LatLngBounds();
      if(distriAr[i].b.b.length>1){
        for (var j = 0; j < distriAr[i].b.b.length; j++) {

          for (var k = 0; k < distriAr[i].b.b[j].b["0"].b.length; k++) {
            centerLatLong.extend(distriAr[i].b.b[j].b["0"].b[k]);
          }
        }
      }else {
        for (var r = 0; r < distriAr[i].b.b["0"].b.length; r++) {
        centerLatLong.extend(distriAr[i].b.b["0"].b[r]);
        }
      }
        //latPol.extend(polis[i].b.b["0"].b["0"]);
        var lat = centerLatLong.getCenter().lat();
        var long = centerLatLong.getCenter().lng();   
        console.log(lat);
        console.log(long);
        var desc = {latD:lat,longD:long};
        distriCenters.push(desc);
  }
}

function getHousingData(URL){
    var data = $.get(HOUSING_NY_DATASET, function(){})
        .done(function(){
            var dataHousing = data.responseJSON.data;
            for(var i = 0; i < dataHousing.length; i++){                  
                    var desc = {br:dataHousing[i][15],income:dataHousing[i][31]};
                    housingDescription.push(desc);           
            }
            var tableRef = $("#tableCheap")[0];
            var brough, incomes;
            housingDescription.sort(function(a, b){return -(a.income - b.income)});           
            for(var k = 0; k < 9; k++){
                if(controlHousing < 9){
                    nRow = tableRef.insertRow(tableRef.rows.length);
                    brough = nRow.insertCell(0);                
                    incomes = nRow.insertCell(1); 
                    brough.innerHTML = housingDescription[k].br;                  
                    incomes.innerHTML = housingDescription[k].income;
                    controlHousing++;
                }
            }
            console.log(broughCrimes);
        })
        .fail(function(error){
            console.log(error);
        })
}

function hasElement(element){
    for(var i = 0; i < broughCrimes.length; i++){
        var bC = broughCrimes[i];
        if(bC.name == element){
            return true;
        }
    }
    return false;
}

function countCrimes(cityName){
    var counter = 0;
    for(var i = 0; i < infoCr.length; i++){
        var city = infoCr[i][0];
        if(city == cityName){
            counter++;
        }
    }
    return counter;
}

function downloadS(){
    $("#ts").tableToCSV();
}

function downloadN(){
    $("#tn").tableToCSV();
}

function downloadC(){
    $("#tc").tableToCSV();
}
 
/*---------------------------------Google maps------------------------------------------------------------------------------*/
function nyMap(){
    map = new google.maps.Map(document.getElementById("map"), {
      center: {lat:40.729100  , lng:  -73.996500},
      zoom: 9.8
    });   
    map.data.loadGeoJson(NHOOD_GEOSHAPES_GEODATA);
    var n=0;
    var luckyAr=[];
    map.data.setStyle(function(feature) {
        distriAr[n]=feature;
        luckyAr[n]=feature.getProperty("BoroCD");
        n++
        var color;
        var boro=feature.getProperty("BoroCD")/100>>0;
        if(boro==1){
                color="#34b57a";
           }
                if(boro==2){
                color="#629ceb";
           }
                if(boro==3){
                color="#8c53bc";
           }
                if(boro==4){
                color="#d9e671";
           }
                if(boro==5){
                color="#eba162";
           }
        
        if (feature.getProperty('isColorful')) {
            color = feature.getProperty('color');
        }
        var noBoro =feature.getProperty("BoroCD")/100>>0;
        var noDis=feature.getProperty("BoroCD")%100;
        var desc = {nbro:noBoro, ndis:noDis};
        districtDescription.push(desc); 
        getCen();
        console.log(districtDescription);
        return ({
                  fillOpacity: 0.1,    
                  fillColor: color,
                  strokeColor: color,
                  strokeWeight: 2
        });
    });
   map.data.addListener('click', function(event) {
        event.feature.setProperty('isColorful', true);
    });            
    map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 8});
    });
    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();
    });
}
/*---------------------------------readyjQuery------------------------------------------------------------------------------*/
$(document).ready(function () {    
  $("#dS").hide();      
  $("#dC").hide();
  $("#dN").hide();   
  $("#safe").click(function(){
       $("#tableSafe").show();
       getCrimesData();
       document.getElementById("ps").scrollIntoView();       
       $("#tableCheap").hide();      
       $("#tableNear").hide();   
       $("#dS").show();      
       $("#dC").hide();
       $("#dN").hide();    
  });
  $("#near").click(function (){
       $("#tableNear").show(); 
       getNamesData();
       document.getElementById("pn").scrollIntoView();
       $("#tableSafe").hide();
       $("#tableCheap").hide();
       $("#dN").show();      
       $("#dC").hide();
       $("#dS").hide();      
  }); 
  $("#cheap").click(function (){
      $("#tableCheap").show();      
      getHousingData(); 
      document.getElementById("pc").scrollIntoView();
      $("#tableSafe").hide();
      $("#tableNear").hide();
       $("#dC").show();      
       $("#dS").hide();
       $("#dN").hide();      
  }); 
  $("#dS").on("click",downloadS); 
  $("#dN").on("click",downloadN);     
  $("#dC").on("click",downloadC);     
});