	function Estimate (theLineItemsList){
		this.lineItemsList = theLineItemsList;
	}

		Estimate.prototype = {
		constructor: Estimate,
		addToLineItemsList:function (lineItemToAdd){
			this.lineItemsList.push(lineItemToAdd);
		}
	};

	newEstimate = new Estiamte({});

	function LineItem (theActive, theIdentifier, theQauntity, theOptions, theType, theBasePrice) {
		this.active = theActive;
		this.identifier = theIdentifier;
		this.quantity = theQauntity;
		this.options = theOptions;
		this.type = theType;
		this.basePrice = theBasePrice;
	}