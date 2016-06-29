$( document ).ready(function() {
	console.log("Ready!");

	function Estimate (theLineItemsList){
		this.lineItemsList = theLineItemsList;
	}

		Estimate.prototype = {
		constructor: Estimate,
		addToLineItemsList:function (lineItemToAdd){
			this.lineItemsList.push(lineItemToAdd);
		},
		nextLineItemID:function (){
			var nextID;
			var listLength = this.lineItemsList.length;
			if(listLength === undefined){
				nextID = 0;
			} else {
				nextID = listLength;
			}
			return nextID;
		},
	};

	newEstimate = new Estimate([]);

	function LineItem (theIdentifier, theActiveState, theQauntity, theType, theBasePrice, theTieLength) {
		this.identifier = theIdentifier;
		this.active = theActiveState;
		this.quantity = theQauntity;
		this.type = theType;
		this.basePrice = theBasePrice;
		this.TieLength = theTieLength;
	}


	$("#addNecktie").click(function(){
		console.log("Added a tie!");
		id = newEstimate.nextLineItemID();
		newLineItem = new LineItem(id, true, 1, "necktie", 45, "std");
		newEstimate.addToLineItemsList(newLineItem);
		var source = $('#necktie-template').html();
		var template = Handlebars.compile(source);
		var hmm = template({identifier: id});
		$("#line-items").append(hmm);
	});

		$("#addBowTie").click(function(){
		console.log("Added a bow tie!");
		id = newEstimate.nextLineItemID();
		newLineItem = new LineItem(id, true, 1, "bow tie", 45, "");
		newEstimate.addToLineItemsList(newLineItem);
	});

		$("#addScarf").click(function(){
		console.log("Added a scarf!");
		id = newEstimate.nextLineItemID();
		newLineItem = new LineItem(id, true, 1, "scarf", 45, "");
		newEstimate.addToLineItemsList(newLineItem);
	});

		$("#addPocketSquare").click(function(){
		console.log("Added a pocket square!");
		id = newEstimate.nextLineItemID();
		newLineItem = new LineItem(id, true, 1, "pocket square", 15, "");
		newEstimate.addToLineItemsList(newLineItem);
	});

});