$(function() {
    'use strict';

    var client;
    var climbers;
    var parClimbing;
    var seqClimbing;
    var historyStep = 0;
    var allDone = false;
    var plotting;
    var colors = ['#ff0000', '#ffa07a', '#ffd700', '#00ff00',
                '#00ff7f', '#808000', '#008080', '#00bfff',
                '#000080', '#483d8b', '#ee82ee', '#4b0082'];

    function plotPoint(){
        console.log("\nHistory step " + historyStep + " \n");
        if(historyStep > 0){
            Plotly.deleteTraces('chart',1);
        }
        var xx = [];
        var yy = [];
        var zz = [];
        allDone = true;
        var climbersCount = Object.keys(climbers).length;
        for(let index = 1; index <= climbersCount; ++index){
            var history = climbers[index]['history'];
            var step = historyStep;
            if(historyStep >= history.length){
                step = history.length - 1;
            }
            else{
                allDone = false;
            }
            var climbingStep = climbers[index]['history'][step];
            var x = climbingStep['x'];
            var y = climbingStep['y'];
            var z = func(x,y);
            console.log("( " + x + " , " + y + "," + z + ") ");
            xx.push(x);
            yy.push(y);
            zz.push(z);
        }
        var data = [{
                    x: xx,
                    y: yy,
                    z: zz,
                    mode: 'markers',
                    type: 'scatter3d',
                    marker: {
                        color: colors.slice(0,climbersCount),
                        size: 10
                    }
                }];
        Plotly.plot('chart', data, layout);
        historyStep += 1;
        if(allDone == true){
            historyStep = 0;
            clearInterval(plotting);
        }
    }

    function showMessage(mesg) {
        parClimbing = mesg['parClimbing'];
        seqClimbing = mesg['seqClimbing'];
        climbers = parClimbing['climbers'];
        var climbersCount = Object.keys(climbers).length;
        console.log('Parralel : ' + parClimbing['duration'] + ' at ' + parClimbing['bestPoint']['x'] + '\n');
        console.log('Sequential : ' + seqClimbing['duration'] + ' at ' + seqClimbing['bestPoint']['x'] + '\n');
        showStatus();
        plotting = setInterval(plotPoint, 5);


    }

    function setConnected(connected) {
        $("#connect").prop("disabled", connected);
        $("#disconnect").prop("disabled", !connected);
        if (connected) {
            $('#noProcs').focus();
        }
    }

    function showStatus(){
        $('#parStatus').html("Parallel : " + parClimbing['duration']);
        $('#seqStatus').html("Sequential : " + seqClimbing['duration']);
        $('#bestPoint').html("Best Point : " + parClimbing['bestPoint']['score']
                    + " at (" + parClimbing['bestPoint']['x'] + ", " + parClimbing['bestPoint']['y'] + ")");
    }

    $("form").on('submit', function (e) {
	    e.preventDefault();
    });

    setConnected(false);

    $('#connect').click(function() {
        client = Stomp.over(new SockJS('/chat'));
        client.connect({}, function (frame) {
            setConnected(true);
            client.subscribe('/topic/messages', function (message) {
                showMessage(JSON.parse(message.body));
            });
        });
    });

    $('#disconnect').click(function() {
        if (client != null) {
            client.disconnect();
            setConnected(false);
        }
        client = null;
    });

    $('#send').click(function() {
        var noProcs = $('#noProcs').val();
        var noClimbers = $('#noClimbers').val();
        client.send("/app/chat/" + noProcs, {}, JSON.stringify({
            noProcs: $("#noProcs").val(),
            noClimbers: $('#noClimbers').val(),
        }));
        $('#noProcs').val("");
        $('#noClimbers').val("");
    });

    $('#stop').click(function(){
        clearInterval(plotting);
        climbers = null;
        historyStep = 0;
        allDone = false;
    });

    function getData() {
    	var arr = [];
    	for(let i = 0; i < 100; i++) {
            var data = [];
            for(let j = 0; j < 100; j++){
                data.push(func(i,j));
            }
            arr.push(data)
    	}
    	return arr;
    }

    function func(phi, p) {
    	var result = 35000 * Math.sin(3 * phi) * Math.sin(2 * p)
    		+ 9700 * Math.cos(10 * phi) * Math.cos(20 * p)
    		- 800 * Math.sin(25 * phi + 0.03 * 3.1415)
    		+ 550 * Math.cos(p + 0.2 * 3.1415);
    		return result;
    }
    var data = getData();
    var layout = {
    	autosize: false,
    	width: 1000,
    	height: 1000,
    	l: 0,
    	r: 0,
    	b: 0,
    	t: 0,
    	showlegend: false
    };

    Plotly.newPlot('chart', [{
    	z: data,
    	showscale: false,
    	type: 'surface'
    }], layout);
});
