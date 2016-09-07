$( document ).ready(function() {



	function Estimate (theLineItemsList, theTotalPrice){
		this.lineItemsList = theLineItemsList;
		this.totalPrice = theTotalPrice;
		this.bulkEligible = 0;
	}

	Estimate.prototype = {
		constructor: Estimate,
		addToLineItemsList:function (lineItemToAdd){
			this.lineItemsList.push(lineItemToAdd);
			thisEstimate.getBulkCount();
			thisEstimate.updateTotalPrice();
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
		updateLineItem: function(lineItemID, changedField, newValue){
			changedLineItem = thisEstimate.lineItemsList[lineItemID];
			if(changedField === "quantity"){
				changedLineItem.quantity = parseInt(newValue);
				changedLineItem.linePrice = newValue * (changedLineItem.unitPrice + changedLineItem.modifierPrice);
			}else{
				changedLineItem.option = newValue;
				if(newValue == "Standard Length"){
					changedLineItem.modifierPrice = 0;
				} else if(newValue == "Extra-Long"){
					changedLineItem.modifierPrice = 5;
				} else if(newValue == "Extra-Extra-Long"){
					changedLineItem.modifierPrice = 10;
				}
				changedLineItem.linePrice = (changedLineItem.unitPrice + changedLineItem.modifierPrice) * changedLineItem.quantity;
			}
			thisEstimate.getBulkCount();
			thisEstimate.updateTotalPrice();
		},

		getBulkCount: function(){
			var lineItems = thisEstimate.lineItemsList;	
			var bulkCount = 0;
			for (var i = lineItems.length - 1; i >= 0; i--) {
				productType = lineItems[i].product;
				if (lineItems[i].active && ((productType == "necktie") || (productType == "bow tie") || (productType =="scarf"))){
					bulkCount += lineItems[i].quantity;
				}
				
			}
			console.log("bulk count " + bulkCount);
			return bulkCount;
		},
		setBulkRate: function(){
			var bulkCount = thisEstimate.getBulkCount();
			var bulkRate; 

			switch (true) {
				case bulkCount<5:
				bulkRate = 45;
				break;
				case bulkCount<10:
				bulkRate = 41;
				break;
				case bulkCount<25:
				bulkRate = 38;
				break;
				case bulkCount<50:
				bulkRate = 36;
				break;
				case bulkCount<100:
				bulkRate = 33;
				break;
				case bulkCount<250:
				bulkRate = 30;
				break;
				case bulkCount<500:
				bulkRate = 27;
				break;

			}
			return bulkRate;

		},
		updateTotalPrice: function(){
			var lineItems = thisEstimate.lineItemsList;
			var totalPrice = 20;
			for (var i = lineItems.length - 1; i >= 0; i--) {
				if (lineItems[i].active){
					totalPrice += lineItems[i].linePrice;
				}
			}
			thisEstimate.totalPrice = totalPrice;
			$("#total-price").text(totalPrice);
		}
	};

	thisEstimate = new Estimate([], 0);

	function LineItem (theIdentifier, theProduct) {
		this.active = true;
		this.quantity = 1;
		this.identifier = theIdentifier;
		this.product = theProduct.name;
		this.unitPrice = theProduct.basePrice;
		this.linePrice = theProduct.basePrice;
		this.modifierPrice = 0;
		this.options = theProduct.options.optionOne;
	}

	LineItem.prototype = {
		constructor: LineItem,
		addProduct:function (productToAdd){
			var productName = productToAdd.name;
			id = thisEstimate.nextLineItemID();
			newLineItem = new LineItem(id, productToAdd);
			thisEstimate.addToLineItemsList(newLineItem);
			var source = $("#product-template").html();
			var template = Handlebars.compile(source);
			var productTemplate = template({
				identifier: id,
				productName: productName,
				price: productToAdd.basePrice,
				isNecktie: productName == "necktie"
			});
			$("#line-items").append(productTemplate);
			$(".remove").click(function(){
				var str = this.id;
				var n = str.lastIndexOf('-');
				var result = str.substring(n + 1);
				thisEstimate.lineItemsList[result].active = false;
				$("#line-item-" + result).hide();
				thisEstimate.updateTotalPrice();
			});
			$(".quantity").change(function(){
				lineid = this.getAttribute("data-lineid");
				thisEstimate.updateLineItem(lineid, "quantity", this.value);
				changedLineItem = thisEstimate.lineItemsList[lineid];
				newQuantity = parseInt(this.value);
				$("#line-item-quantity-" + lineid).text(newQuantity);
				$("#modified-unit-price-" + lineid).text(changedLineItem.unitPrice + changedLineItem.modifierPrice);
				$("#line-item-price-" + lineid).text(changedLineItem.linePrice);
			});
			$(".options").change(function(){
				lineid = this.getAttribute("data-lineid");
				thisEstimate.updateLineItem(lineid, "options", this.value);
				changedLineItem = thisEstimate.lineItemsList[lineid];
					//newQuantity = this.value;
					//$("#line-item-quantity-" + lineid).text(this);
					$("#line-item-price-" + lineid).text(changedLineItem.linePrice);
					$("#modified-unit-price-" + lineid).text(changedLineItem.unitPrice + changedLineItem.modifierPrice);
				});
			$('form').on('keypress', function(e) {
				return e.which !== 13;
			});
		}
	};

	function Product (theName, theBasePrice, theOptions){
		this.name = theName;
		this.basePrice = theBasePrice;
		this.options = theOptions;
	}

	necktie = new Product("necktie", 45, {optionOne: "standard"});
	bowTie = new Product("bow tie", 45, {});
	scarf = new Product("scarf", 45, {});
	pocketSquare = new Product("pocket square", 15, {});



	$("#addNecktie").click(LineItem.prototype.addProduct.bind($, necktie));
	$("#addBowTie").click(LineItem.prototype.addProduct.bind($, bowTie));
	$("#addScarf").click(LineItem.prototype.addProduct.bind($, scarf));
	$("#addPocketSquare").click(LineItem.prototype.addProduct.bind($, pocketSquare));
});