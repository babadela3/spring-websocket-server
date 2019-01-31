$(function() {
    'use strict';

    var client;

    function showMessage(mesg) {
        console.log(mesg);
        var xx = [];
        var yy = [];
        var zz = [];

        xx.push(Math.random() * 20);
        yy.push(Math.random() * 20);
        zz.push(Math.random() * 30000);
        var data = [{
        	x: xx,
        	y: yy,
        	z: zz,
        	mode: 'markers',
        	type: 'scatter3d',
        	marker: {
                color: 'rgb(255, 153, 0)',
        	    size: 10
            }
        }];
        Plotly.plot('chart', data, layout);
    }

    function setConnected(connected) {
        $("#connect").prop("disabled", connected);
        $("#disconnect").prop("disabled", !connected);
        $('#from').prop('disabled', connected);
        $('#text').prop('disabled', !connected);
        if (connected) {
            $('#text').focus();
        }
    }

    $("form").on('submit', function (e) {
	    e.preventDefault();
    });

    $('#from').on('blur change keyup', function(ev) {
	    $('#connect').prop('disabled', $(this).val().length == 0 );
    });
    $('#connect,#disconnect,#text').prop('disabled', true);

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
        var topic = $('#topic').val();
        client.send("/app/chat/" + topic, {}, JSON.stringify({
            from: $("#from").val(),
            text: $('#text').val(),
        }));
        $('#text').val("");
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
    	width: 1700,
    	height: 1700,
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
