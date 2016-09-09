var isotopes;
var chains;

// Load data
d3.json('/isotope_data', function(err, json){
    if(err){return console.warn(err);}
    isotopes=json;
    d3.json('/decay_chains', function(err, json) {
        if (err) {return console.warn(err);}
        chains = json;
        render(isotopes, chains);
    });
});

function render(isotopes, chains) {
    var clicked = false;
    var height = 500;
    var width = 800;
    var unselected_color = '#444444';
    var selected_color = '#000000';
    var decay_end_color = '#33AA33';
    var margin = {'top':10, 'bottom':10, 'left':10, 'right':10}


    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var debug = d3.select("body").append("h2")

    var z_vals = isotopes.map(function (x) {return x.z})
    var n_vals = isotopes.map(function (x) {return x.n})

    var x = d3.scale.linear()
        .domain([d3.min(n_vals), d3.max(n_vals)])
        .range([margin.left, width - margin.right]);

    var y = d3.scale.linear()
        .domain([d3.min(z_vals), d3.max(z_vals)])
        .range([height - margin.bottom, margin.top]);
    
    var stable_color = function(d) {
		if (!d.decay.length){
			return "#3333BB";
		} else {
			return unselected_color;
		}
         } 

    var decay_color = function (n, max) {
        var partitions = Math.floor(max/3);
        var r = Math.min(Math.floor((255/partitions) * n), 255).toString(16);
        var g = Math.max(Math.min(Math.floor(((255/partitions) * n) -255), 255), 0).toString(16);
        var b = Math.max(Math.min(Math.floor(((255/partitions) * n) - 510), 255), 0).toString(16);
        if (r.length < 2) {
            r = "0" + r
        } if (g.length < 2) {
            g = "0" + g
        } if (b.length < 2) {
            b = "0" + b
        }
        return '#'+r+g+b
    }

    var square_height = (y(1) - y(2));
    var square_width = (x(2) - x(1));
    var color_decay_chain = function(e) {
			if (Object.keys(chains[d.nuclide_symbol]).indexOf(e.nuclide_symbol) != -1){
			    if (!e.decay.length) {
				    return decay_end_color;
			    } else {
			    return decay_color(chains[d.nuclide_symbol][e.nuclide_symbol], 20)
			    }
			} else {
			    return stable_color(e)
			}
		    }

    var rects = svg.selectAll("rect")
        .data(isotopes)
        .enter().append("rect")
        .attr("x", function(d){return x(d.n)})
        .attr("y", function(d){return y(d.z)})
        .attr("width", square_width)
        .attr("height", square_height)
        .attr("fill", stable_color)
        .on("mouseover", function (d) {
            if (!clicked) {svg.selectAll("rect")
	      .data(isotopes)
	      .attr("fill", color_decay_chain );
            debug.html(d.nuclide_symbol);
	    d3.select(this).attr("fill", selected_color);
            }}
        ).on("click", function(d) {
	  if (!clicked) {
	      clicked = true;
	      svg.selectAll("rect")
              .data(isotopes)
              .attr("fill", function(e) {
                if (Object.keys(chains[d.nuclide_symbol]).indexOf(e.nuclide_symbol) != -1){
                    //console.log(e)
                    if (!e.decay.length) {
                            return decay_end_color;
                    } else {
                    return decay_color(chains[d.nuclide_symbol][e.nuclide_symbol], 20)
                    }
                } else {
                    return stable_color(e)
                }
            }
            );} else {
		clicked = false;
	   }
	});

}
