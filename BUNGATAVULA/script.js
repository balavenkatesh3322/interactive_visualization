$(document).ready(function() {

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

	var width = 960, height = 450, radius = Math.min(width, height) / 2;

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3.svg.arc().outerRadius(radius * 0.8).innerRadius(radius * 0);

	var outerArc = d3.svg.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var colors = ["#008066","#2f4b7c","#de425b","#a05195","#d45087","#ffa600"]
	var color = d3.scale.ordinal()
		.domain(data.map(d=> d.fire_name))
		.range(colors);

	function randomData (d){
		var tot = d.reduce((d,i)=> d+i.acres, 0);
		d.map(d=> d.percentage = ((d.acres/tot) * 100).toFixed(2));
		var c = d3.scale.ordinal()
		.domain(d.map(d=> d.fire_name + " (" + d.percentage + "%)"))
		.range(colors);

		var labels = c.domain();
			return d.map(function(label, index){
				return { label: labels[index], value: label.acres }
		});
	}

	change(randomData(data));

	function change(data) {

		var key = function(d){ return d.data.label};

		var slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);

		slice.enter().insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", "slice");

		slice.transition().duration(2000).attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

		slice.exit().remove();

		var text = svg.select(".labels").selectAll("text").data(pie(data), key);

		text.enter().append("text").attr("dy", ".35em").text(function(d) {
			return d.data.label;
		}).style("fill", function(d) { return color(d.data.label); });;
		
		function midAngle(d){
			return d.startAngle + (d.endAngle - d.startAngle)/2;
		}

		text.transition().duration(1000).ease("bounce")
			.attrTween("transform", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		text.exit().remove();

		var polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);
		
		polyline.enter().append("polyline");

		polyline.transition().duration(1000).ease("bounce")
			.attrTween("points", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});
		
		polyline.exit().remove();
	};

	var select = $('<select>').prop('id', 'land')
					.prop('name', 'land').append($("<option>")
					.prop('value', "select")
					.text("select"));

	var months = data.map(d => d.month).filter((x, i, a) => a.indexOf(x) == i);

	$(months).each(function() {
		select.append($("<option>")
		.prop('value', this)
		.text(this.charAt(0).toUpperCase() + this.slice(1)));
	});

	var label = $("<label>").prop('for', 'land').text("Choose month: ");

	var br = $("<br>");

	$('#container').append(label).append(select).append(br);

	$("#land").on("change",function(e) {
		var filteredData = data.filter(d=> d.month == this.value);
		if(this.value == "select"){
			filteredData = data;
		}
		change(randomData(filteredData));
	});
});