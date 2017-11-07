'use strict'; //strict mode: catch silly errors
    
//the SVG to add stuff to


var svg1 = d3.select('#vis-container')
		.append('svg')


function barDataPro(data) { //parse businesses data for barcharts
	
	//get the counts of each rating
	var barData = {onestar:0, onehalfstar: 0, twostars: 0, twohalfstars: 0, threestars: 0, threehalfstars: 0, fourstars: 0, fourhalfstars: 0, fivestars: 0}

	for (var i=0; i<data.length; i++) {
		var rateVal = data[i]['rating']; //iterate through business data to get the rating value for each business

		if(rateVal==1){
			barData.onestar ++;
		}
		if(rateVal==1.5){
			barData.onehalfstar ++;
		}
		if(rateVal==2){
			barData.twostars ++;
		}
		if(rateVal==2.5){
			barData.twohalfstars ++;
		}
		if(rateVal==3){
			barData.threestars ++;
		}
		if(rateVal==3.5){
			barData.threehalfstars ++;
		}
		if(rateVal==4){
			barData.fourstars ++;
		}
		if(rateVal==4.5){
			barData.fourhalfstars ++;
		}
		if(rateVal==5){
			barData.fivestars++;
		}
		
	}
	

	var barChartData = []; 

			for (var key in barData) { //convert js object to a list of objects 
				var tempObj = {};
				tempObj.Rating = key;
				tempObj.numOfBiz = barData[key];
				barChartData.push(tempObj);			
			}

	 return barChartData;
}

// draw barcharts based on the number of business for each rating
function updateBarchart(dataList) {
	var barChartData = barDataPro(dataList); //call the parse function to parse raw business data

	var	margin = {top: 60, right: 30, bottom: 60, left: 130};
	var height = 600 - margin.top - margin.bottom;
	var width = 1000 - margin.left - margin.right;
	
	svg1.attr('height', height + margin.top + margin.bottom) // 600 can adjust size as desired
		.attr('width', width + margin.left + margin.right); // 1000 can adjust size as desired

	var tip = d3.tip()
  		.attr('class', 'd3-tip')
  		.offset([0, 40])
  		.html(function(d) {
   		 return "<strong>Number of Bussiness:</strong> <span style='color:yellow'>" + d.numOfBiz + "</span>";
  	})
	svg1.call(tip);

	var xScale = d3.scale.linear()
                          .domain([0, 1000])
                          .range([0, width]);

    var yScale = d3.scale.ordinal()
                          .domain(['onestar', 'onehalfstar', 'twostars', 'twohalfstars', 'threestars', 'threehalfstars', 'fourstars', 'fourhalfstars', 'fivestars'])
                          .rangeBands([height, margin.top],0.1);
                    
	var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(10);
	var yAxis = d3.svg.axis().scale(yScale).orient('left');


	svg1.append('g')
		.attr('class', 'x axis')
		.attr('transform', "translate("+margin.left+","+height+")")		
		.call(xAxis)
	  .append('text')
	  	.attr('transform', "translate("+width/2+","+30+")")	
	  	.attr('font-size', '14px')
	  	.style('text-anchor', 'middle')
      	.text('Number of Business');

	
	svg1.append('g')
		.attr("class", "y axis")
		.attr("transform", "translate("+margin.left+",0)")	
		.call(yAxis)
	  .append('text')
	  	.attr('transform', "translate("+(-100)+","+(height/2+margin.top/2)+")"+'rotate(-90)') 
	  	.attr('font-size', '14px')
	  	.style('text-anchor', 'middle')
      	.text('Rating')
      	

	var rectList = svg1.selectAll('.bar'); // reference all the rects in the svg
	var dataJoin = rectList.data(barChartData); //data binding

	dataJoin.enter().append('rect')

	dataJoin
	.attr('class','bar')
	.attr('x', margin.left+10)
	.attr('width', function(d) {return xScale(d.numOfBiz); })
	.attr('y', function(d) {return yScale(d.Rating); })
	.attr('height', yScale.rangeBand()) //all rects have same x and height
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide)

	dataJoin.exit().remove();


}
 

var svg2 = d3.select('#vis-container')
		.append('svg');

// draw bubble charts based of the number of business for each category
 function updateBubbleChart(dataList) {
	 	var tip = d3.tip()
  		.attr('class', 'd3-tip')
  		.offset([0, 40])
  		.html(function(d) {
   		 return "<strong>Number of Bussiness:</strong> <span style='color:yellow'>" + d.value + "</span>" + ", " + "<strong>Category:</strong> <span style='color:yellow'>"+d.category;
  	})
	svg2.call(tip);
	 //convert data return an array of object
	 svg2.selectAll("*").remove();
	var data = dataReorganize(dataList);
	//convert numerical values from strings to numbers
	data = data.map(function(d){d.value = +d["count"]; return d;});
	var diameter = 500,//max size of the bubbleChartData
		color = d3.scale.category20b(); //color catetory
		
	var bubble = d3.layout.pack()//create a new pack layout with the default setting
					.sort(null)
					.size([diameter,diameter])
					.padding(1.5);
	 svg2.attr('height', diameter) //can adjust size as desired
		.attr('width', diameter)
		.attr("class","bubble");
	
	 var nodes = bubble.nodes({children: data}).filter(function(d){ return !d.children;});
		 
	var bubbles = svg2
		.selectAll(".bubble")
		.data(nodes);
	
	bubbles.enter().append("circle");
	
	bubbles
		.attr("r", function(d){return d.r;})
		.attr("cx", function(d){ return d.x; })
		.attr("cy", function(d){ return d.y; })
		.style("fill", function(d) { return color(d.category); })
		//mouseover showing category and number of stores
		// .append("svg:title")
		// .text(function(d) { return "category: "+ d.category + ", " + "number of stores: "+ d.value; })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
	
 }
 
 
 
//reorganise the format of the data into dictionaries of different categories
 function dataReorganize2(businessData){
  	var bubbleChartData = {};
	businessData.forEach(function(item){
		item.categories.forEach(function(item){
			if (item[1] in bubbleChartData){
				bubbleChartData[item[1]] += 1;
			} 
			else{
				bubbleChartData[item[1]] = 1;
			}
		})
	}); 
	return bubbleChartData;
 }
 
 //change the object format above to array of objects
 function dataReorganize(rawData){

	 var bubbleChartData = dataReorganize2(rawData);
	 var bubbleChartArray = [];
	    //console.log(bubbleChartData);
			for (var key in bubbleChartData) {
				var tempObj = {};
				tempObj.category = key;
				tempObj.count = bubbleChartData[key];
				//  console.log(tempObj);
				bubbleChartArray.push(tempObj);
				
			}
			//console.log(bubbleChartArray);
	 return bubbleChartArray;
 }

/*stream data*/
function streamData(businesses, oauth, business, location, reviewmin, i, finished) {
	var parameters = {
	location : location,
	term : business,
	offset : String(i * 20), 
	oauth_consumer_key: oauth.consumer_key,
	oauth_token: oauth.token,
	oauth_nonce: 'kllo9940pd9333jh',
	oauth_timestamp: Math.floor(Date.now()/1000),
	oauth_signature_method: 'HMAC-SHA1',
	oauth_version : '1.0',
	callback: 'cb' + String(i)              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.				
	};     
	
	var encodedSignature = oauthSignature.generate('GET', 'http://api.yelp.com/v2/search', parameters, oauth.consumer_secret, oauth.token_secret);
	parameters.oauth_signature = encodedSignature;
	

	var settings = {
	url: 'http://api.yelp.com/v2/search',
	data: parameters,
	cache: true,  //        <----  This is crucial to include as well to prevent jQuery from 
								// adding on a cache-buster parameter "_=23489489749837", 
								// invalidating our oauth-signature
	dataType: 'jsonp',
	jsonpCallback : 'cb' + String(i),
	success : function(data, textStats, XMLHttpRequest) {
					for(var i=0; i<20; i++) //only 20 businesses can be downloaded for each request; 
											//iterate through the 20 business objects and find out the ones with review count more than user's input minimum count
					{
						if(data.businesses[i].review_count >= reviewmin ){
							businesses.push(data.businesses[i])
						}
					}

					if(finished) // if request counts exceed its daily limits (50), draw bubble charts and bar charts
					{
						$('#loading').remove();
						updateBubbleChart(businesses);//call bubblechart function
						updateBarchart(businesses); //call barchart function
	
					}
					
					
				},
	error: function(jqXHR, exception, errorstr) {
					console.log(jqXHR);
					alert(errorstr);
				}
	};
	
	$.ajax(settings); // Send AJAX request via jQuery library


}

$('#searchButton').click(function () { //search based on users' input
	var businessSearch = $('#business_searchBox').val(); //listen to users' input and get the value of the input box
	var locationSearch = $('#location_searchBox').val(); 
	var reviewcountmin = $('#lsl').val();
	 svg2.selectAll("*").remove();
	 svg1.selectAll("*").remove();
	//set defalut values for three input boxes
	if(businessSearch==''){   
		businessSearch='restaurant';
	}
	if(locationSearch==''){
		locationSearch='san+francisco'
	}
	if(reviewcountmin==''){
		reviewcountmin=100;
	}
	
	
	var businesses = []; // define a list of business to save business objects downloaded from API
	var token = $.getJSON('config_secret.json') //get token from external file
	token.then(function(oauth){
		
		$('#search').append('<div id='+'loading style='+'margin-top:5em'+'>Loading the data...it will take a few seconds</div>')
		for(var i=0; i<50; i++){
			streamData(businesses, oauth, businessSearch, locationSearch, reviewcountmin,  i, i==49);
			
			
		}	
	})
	
})




						