
	var data = [
		{
		"fire_name": "Mendocino Complex",
		"acres": 459123,
		"month": "July",
		},
		{
		"fire_name": "Thomas",
		"acres": 281893,
		"month": "December",
		},
		{
		"fire_name": "Cedar",
		"acres": 273246,
		"month": "October",
		},
		{
		"fire_name": "Rush",
		"acres": 271911,
		"month": "August",
		},
		{
		"fire_name": "Rim",
		"acres": 257314,
		"month": "August",
		},
		{
		"fire_name": "Zaca",
		"acres": 240207,
		"month": "July",
		}
	]

	var svg = d3.select("body").append("svg").append("g")

	svg.append("g").attr("class", "slices");
	svg.append("g").attr("class", "labels");
	svg.append("g").attr("class", "lines");

	var width = 960, height = 450, radius = Math.min(width, height) / 2 - 50;

	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var colors = ["#008066","#2f4b7c","#de425b","#a05195","#d45087","#ffa600"]
	var color = d3.scaleOrdinal()
		.domain(data.map(d=> d.fire_name))
		.range(colors);

	function randomData (d){
		var tot = d.reduce((d,i)=> d+i.acres, 0);
		d.map(d=> d.percentage = ((d.acres/tot) * 100).toFixed(2));
		var c = d3.scaleOrdinal()
		.domain(d.map(d=> d.fire_name + " (" + d.percentage + "%)"))
		.range(colors);

		var labels = c.domain();
			return d.map(function(label, index){
				return { label: labels[index], value: label.acres }
		});
	}

	change(randomData(data));

	function change(data) {

		var arc = d3.arc().innerRadius(0).outerRadius(radius);
		var outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius*0.9);
		var label = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

		var key = function(d){ return d.data.label};
		var pie = d3.pie().sort(null)
			.value(function(d) {
				return d.value;
			});
		
		var slice = svg.select(".slices")
			.selectAll("path.slice").data(pie(data), key)
			.join("path")
			.style("fill", function(d,i) { return color(d.data.label); })
			.attr("class", "slice")
			.attr("d", arc);

		slice.exit().remove();


		function midAngle(d){
			return d.startAngle + (d.endAngle - d.startAngle)/2;
		}

		var text = svg.select(".labels").selectAll("text").data(pie(data), key)
		.join("text").attr("dy", ".35em").text(function(d) {
			return d.data.label;
		})
		.style("fill", function(d) { return color(d.data.label); })
		.attr("transform", function(d) {
			var pos = outerArc.centroid(d);
			pos[0] = radius * (midAngle(d) < Math.PI ? 1.1 : -1.1);
			var percent = (d.endAngle - d.startAngle)/(2*Math.PI)*100
				if(percent<3){
				pos[1] += i*15
			}
		  return 'translate(' + pos +')';
		})
		.attr("text-anchor", 'left')
		.attr("dx", function(d){
			var ac = midAngle(d) < Math.PI ? 0:-100
			return ac
		})
		.attr("dy", 5 );

		text.exit().remove();

		var polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key)
		.join("polyline")
		.attr("points", function(d){
			var pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
         	var o=   outerArc.centroid(d)
 			var percent = (d.endAngle -d.startAngle)/(2*Math.PI)*100
       		if(percent<3){
       			//console.log(percent)
       			o[1] 
       			pos[1] += i*15
       		}
       		//return [label.centroid(d),[o[0],0[1]] , pos];
        	return [label.centroid(d),[o[0],pos[1]] , pos];		
		})
		.attr("stroke", function(d,i) { return color(i); })
		.style("stroke-width", "1px");
		
	};

	var select = document.createElement("select");
    select.name = "land";
    select.id = "land";

	var option = document.createElement("option");
        option.value = "select";
        option.text = "select";
        select.appendChild(option);

	var months = data.map(d => d.month).filter((x, i, a) => a.indexOf(x) == i);

	for (const val of months)
    {
        var option = document.createElement("option");
        option.value = val;
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
        select.appendChild(option);
    }

	var label = document.createElement("label");
    label.innerHTML = "Choose month: "
    label.htmlFor = "months";

	document.getElementById("container").appendChild(label).appendChild(select);

	var dropdown = document.getElementById("land").addEventListener("change", function(){
		var filteredData = data.filter(d=> d.month == this.value);
	 	if(this.value == "select"){
			filteredData = data;
	 	}
	 	change(randomData(filteredData));
	})
