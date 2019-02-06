$(function() {
    'use strict';

    var client;

    function showMessage(mesg) {
        var parClimbing = mesg['parClimbing'];
        var seqClimbing = mesg['seqClimbing'];
        var climbers = parClimbing['climbers'];
        var climbersCount = Object.keys(climbers).length;
        console.log('Parralel : ' + parClimbing['duration'] + ' at ' + parClimbing['bestPoint']['x'] + '\n');
        console.log('Sequential : ' + seqClimbing['duration'] + ' at ' + seqClimbing['bestPoint']['x'] + '\n');
        var xx = [];
        var yy = [];
        var zz = [];

//        for(let index = 1; index <= climbersCount; ++index){
//            var history = climbers[index]['history'];
//            console.log("Climber : " + index + " has " + history.length + " steps\n");
//        }
        var historyStep = 0;
        var allDone = false;
        while(allDone == false){
            allDone = true;
            console.log("History step " + historyStep + " \n");
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
                xx.push(x);
                yy.push(y);
                zz.push(z);
            }
            var data = [{
                    	x: x,
                    	y: y,
                    	z: z,
                    	mode: 'markers',
                    	type: 'scatter3d',
                    	marker: {
                            color: 'rgb(255, 153, 0)',
                    	    size: 10
                        }
                    }];
            Plotly.plot('chart', data, layout);
            historyStep += 1;
        }

    }

    function setConnected(connected) {
        $("#connect").prop("disabled", connected);
        $("#disconnect").prop("disabled", !connected);
        if (connected) {
            $('#noProcs').focus();
        }
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

    function getData() {
    	var arr = [];
    	for(let i = 0; i < 20; i++) {
        var data = [];
    	for(let j = 0; j < 20; j++){
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
