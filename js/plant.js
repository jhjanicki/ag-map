
// site data

	// queue()
// 	.defer(d3.json, 'data/all_pangolins.geojson')
// 	.defer(d3.json, 'data/countries2.geojson')
// 	.await(makeMyMap);
	
	var countries;
	
	var countries2; //for centroid
	
	var plant;
	
	var plantData;
	
	var selectedPlant;
	
	var selectedPlantID;
	
	var plantArray = ["Banana","Rice","Cassava", "Plantain","Wheat"];
	

	$('#banana, #rice, #cassava, #plantain, #wheat')
	.on('click', function () {
		var $el = $(this);
		selectedPlantID = this.id;
		//console.log($el.data('species'));
		selectedPlant = $el.data('plant');
		drawCircles(selectedPlant,this.id);
		
	});
	
	
	
//functions to draw leaflet+D3 map

	var southWest = L.latLng(23, 122),
    northEast = L.latLng(29, 132),
    bounds = L.latLngBounds(southWest, northEast);

	var map = new L.Map("mapContainer", {
				center: [15.5, 65.7], 
				zoom: 3,
				minZoom:2
			});
		
	var tile1 = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
						attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						}),
		
		tile2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
						attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS'
						});
		
		tile1.addTo(map);
			
	var layerControlItems = {
			  "<div class='layer-titles'> OSM Landscape </div>": tile1,
			  "<div class='layer-titles'> Terrain </div>": tile2
			};
		
		 L.control.layers(layerControlItems).addTo(map);
	
	map.scrollWheelZoom.disable();
	map.touchZoom.disable();

	var svg = d3.select(map.getPanes().overlayPane).append("svg"),
		g = svg.append("g").attr("class", "leaflet-zoom-hide");
		
	var countryPath = g.append("g");
	var plantPath = g.append("g");
	
	function projectPoint(x, y) {
		var point = map.latLngToLayerPoint(new L.LatLng(y, x)); 
		this.stream.point(point.x, point.y); 

	}
	var transform = d3.geo.transform({point: projectPoint}),
		path = d3.geo.path().projection(transform);


	
	
	
	function loadPolygons(){

		
		 d3.json("data/countries2_old.geojson", function(error,adm0){
			  //console.log(adm0.features);
			
			
				
				//append plant data to associated country geojson
				d3.json('data/plantData.json',function(data){
					//console.log(data);
					//console.log(adm0.features);

		  
		  	  		countries = adm0;
					
					plantData = data;
					
					
					adm0.features.forEach(function(d1){
						data.forEach(function(d2){
							if (d1.properties.name == d2.Country){
								d1.properties['banana']=d2.Banana2011;
								d1.properties['cassava']=d2.Cassava2010;
								d1.properties['plantain']=d2.Plantain2010;
								d1.properties['rice']=d2.Rice2011;
								d1.properties['wheat']=d2.Wheat2011;
								d1.properties['HDI']=d2.HDI2014;
								d1.properties['HDIrank']=d2.HDIRanking;
							}
							
						});
					});
					//console.log('plantData');
					//console.log(plantData);
					
					
					var recolorMap = colorScale(plantData);
		  
			  countryPath.selectAll("path")
				   .data(adm0.features)
				   .enter()
				   .append("path")
				   .attr("d", path)
				   .attr("class","country")
				   .attr("fill", function(d) { 
						return choropleth(d, recolorMap);
			 		})
			 		.style("opacity",0.9)
			 		.style("stroke-width",1)
			 		.style("stroke", 'white')
			 		.attr('id',function(d){
			 			return 'c-'+d.id;
			 		
			 		})
			 		.append("desc") //append the current color as a desc element
					.text(function(d) { 
							return choropleth(d, recolorMap); 
				   	});
				   	
				   	
			  countryPath.selectAll("path")
				    .data(adm0.features)
			 		.on('mouseover',function(d){
						d3.select(this).attr('fill','black');
						console.log(d3.select('#c-'+d.id).select("desc").text());   		
					})
					.on('mouseout',function(d){
						var color = d3.select('#c-'+d.id).select("desc").text();
						 d3.select(this).attr('fill',color);		   	
					});


			

					
				drawLegend(plantData);
					
					
					
					
				}); //end json 2
				

				var bounds = path.bounds(adm0),
					topLeft = bounds[0],
					bottomRight = bounds[1];
				
				 svg.attr("width", bottomRight[0] - topLeft[0])
					.attr("height", bottomRight[1] - topLeft[1])
					.style("left", topLeft[0] + "px")
					.style("top", topLeft[1] + "px");

				 g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
		
				
				 //drawPangolinRange();
		
		}); // end adm0
		
			
							
				d3.json("data/countries2.geojson", function(error,adm0){
			  //console.log(adm0.features);
			
			
				
				//append plant data to associated country geojson
				d3.json('data/plantData.json',function(data){
					//console.log(data);
					//console.log(adm0.features);

		  
		  	  		countries2 = adm0;
					
					
					adm0.features.forEach(function(d1){
						data.forEach(function(d2){
							if (d1.properties.name == d2.Country){
								d1.properties['banana']=d2.Banana2011;
								d1.properties['cassava']=d2.Cassava2010;
								d1.properties['plantain']=d2.Plantain2010;
								d1.properties['rice']=d2.Rice2011;
								d1.properties['wheat']=d2.Wheat2011;
								d1.properties['HDI']=d2.HDI2014;
								d1.properties['HDIrank']=d2.HDIRanking;
							}
							
						});
					});
				});
			});
	
	
		
	}

	loadPolygons();
	map.on("viewreset", resetView);
	resetView();
	
	
	function drawCircles(plant, plantid){
	
	    countryPath.selectAll(".bubble").remove();
		//console.log(plant);
		
		//console.log(plantData);
		
		
		var max = d3.max(plantData, function(d) { return d[plant]; })
		var min = d3.min(plantData, function(d) { return d[plant]; })
		//console.log(max);
		//console.log(min);
		
		
		var radius;
		 if(map.getZoom() === 2){
		 	radius = d3.scale.sqrt()
		.domain([min,max])
		.range([0, 20]);
		 
		 }else{
		 	 radius = d3.scale.sqrt()
		.domain([min,max])
		.range([0, 30]);
		 }
		
	
		
		//console.log(countries);
		 countryPath.append("g")
    		.attr("class", "bubble")
  			.selectAll("circle")
    		.data(countries2.features)
  			.enter().append("circle")
    		.attr("transform", function(d) { 
    			// if(d.properties.name == 'United States'){
//     				console.log(d.geometry.coordinates);
//     				d.geometry.type = 'Polygon';
//     				d.geometry.coordinates = d.geometry.coordinates[5];
//     				console.log('peegy');
//     				console.log(d.geometry.coordinates);
//     				return "translate(" + path.centroid(d) + ")"; 
//     			}
				
    		
    		if(d.properties.name == 'Canada'){
    			console.log(d.geometry.coordinates);
    		}
    			return "translate(" + path.centroid(d) + ")"; 
    		})
   			.attr("r", function(d) { 
   		 				if(radius(d.properties[plantid])>0){
   		 					return radius(d.properties[plantid]);
   		 				}else{
   		 					return 0;
   		 				}
   		 				
   		 		})
   		 	.attr("id",function(d){
   		 		
   		 		return d.id;
   		 })
   		.on('mouseover',function(d,i){
			
			d3.select("#"+d.id)//select the current county in the dome	
			.attr("fill", '#ffffff')
			.attr("stroke","#ffffff")
			.style('cursor','pointer');
			drawInfolabel(d,i,plantid);
		})
		.on('mouseout',function(d,i){
			
			d3.select("#"+d.id)//select the current county in the dome	
			.attr("fill", '#979c9c')
			.attr("stroke","#343642");
			removeInfolabel(d,i);
		});
			
			drawPlantLegend(min,max);
	
	}
	
	function drawPlantLegend(min,max){
		d3.select('#plantLegend svg').remove();
		
		var linearSize;
		
		if(map.getZoom() === 2){
			linearSize = d3.scale.linear().domain([min,max]).range([0, 20]);
		}else{
			linearSize = d3.scale.linear().domain([min,max]).range([0, 30]);
		}
		

		var legend = d3.select('#plantLegend')
				.append('svg');


		legend.append("g")
		  .attr("class", "legendSize")
		  .attr("transform", "translate(20, 40)");

		var legendSize = d3.legend.size()
		  .scale(linearSize)
		  .shape('circle')
		  .shapePadding(15)
		  .labelOffset(20)
		  .orient('horizontal');

		legend.select(".legendSize")
		  .call(legendSize);
		 
		
		
	}
	
	function getOverlayG() {
		return g;
	}
	
	function getProjection() {
		return function(xy){ return map.latLngToLayerPoint(new L.LatLng(xy[1], xy[0])) };
	}



	function resetView() {
			if (countries) {
				var bounds = path.bounds(countries),
					topLeft = bounds[0],
					bottomRight = bounds[1];
				

				svg.attr("width", bottomRight[0] - topLeft[0] + 1000)
						.attr("height", bottomRight[1] - topLeft[1])
						.style("left", topLeft[0] + "px")
						.style("top", topLeft[1] + "px");

				g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
				
				countryPath.selectAll('path.country').attr("d", path);
				drawCircles(selectedPlant, selectedPlantID);
// 				rangePath.selectAll('path.pangolinRange').attr("d", path);
// 				citesPath.selectAll('path.cites').attr("d", path);
			}
			
	}
	
	
	


	function colorScale(data){
	
	var max = d3.max(data, function(d) { return d.HDI2014; })
	//console.log(max);
	var min = d3.min(data, function(d) { return d.HDI2014; })
		//return the color scale generator
		return d3.scale.linear()
			.domain([min,max])
			.range(['#b30000','#fae4ce']);

	}
	
	function choropleth(d, recolorMap){
		//Get data value
		//console.log(d);
		var value = d.properties.HDI;
		//If value exists, assign it a color; otherwise assign gray
		if (value) {
			return recolorMap(value);
		} else {
			return "#fff";
		};
	};
	
	
	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
		this.parentNode.appendChild(this);
	  });
	};
	
	
	
	function drawLegend(data){
		var max = d3.max(data, function(d) { return d.HDI2014; })
		//console.log(max);
		var min = d3.min(data, function(d) { return d.HDI2014; })
	
		d3.select('#linearLegend svg').remove();
		
		var linear = d3.scale.linear()
		  .domain([min,max])
		  .range(['#b30000', '#fae4ce']);

		var legend = d3.select('#linearLegend')
				.append('svg').attr('width',200).attr('height',60);

		legend.append("g")
		  .attr("class", "legendLinear")
		  .attr("transform", "translate(20,20)");

		var legendLinear = d3.legend.color()
		  .shapeWidth(30)
		  .orient('horizontal')
		  .scale(linear);

		legend.select(".legendLinear")
		  .call(legendLinear);
   
		 
		}
		
		
		function drawInfolabel(d,i,plantid){
		//console.log('peegy');
		//console.log(d);
		//console.log(d);
		
		//console.log("drawInfolabel");
	
		var labelHTML = "<h4>"+d.properties[plantid]+"</h4><b><p>"+plantid+"</b>&nbsp;&nbsp;&nbsp;&nbsp;<i>"+d.properties.name+"</i></p>"
		                +"<h5> Human Development Index: "+d.properties.HDI+"</h5>";
		var infolabel=d3.select("#mapContainer").append("div")
			.attr("class","infolabel")
			.style("box-shadow", "5px 5px 5px #888888")
			.style("background-color", "white") 
			.attr("id", "infolabel-"+i)
			.style("color","black")
			.html(labelHTML);
	
		}
	
		function removeInfolabel(d,i){
			//d3.select(".infolabel").remove();
			d3.select("#infolabel-"+i).remove();
			d3.select("#infolabel-col"+i).remove();
		}
	
	
	
	
	
	



	
