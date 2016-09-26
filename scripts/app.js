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
				changedLineItem.quantity = parseInt(newValue) || 0;
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
			//thisEstimate.updateTotalPrice();
			this.applyBulkRate();
		},

		applyBulkRate: function(){
			bulk = this.setBulkRate();
			bulkRate = bulk.bulkRate;
			bulkSquares = bulk.bulkSquares;
			var lineItems = thisEstimate.lineItemsList;
			for (var i = lineItems.length - 1; i >= 0; i--) {
				productType = lineItems[i].product;
				if (lineItems[i].active && ((productType == "necktie") || (productType == "bow tie") || (productType =="scarf"))){
					lineItems[i].unitPrice = bulkRate;
					lineItems[i].linePrice = (lineItems[i].unitPrice + lineItems[i].modifierPrice) *lineItems[i].quantity;
					$("#modified-unit-price-" + i).text(lineItems[i].unitPrice + lineItems[i].modifierPrice);
					$("#line-item-price-" + i).text(lineItems[i].linePrice);
				} else if (lineItems[i].active && (productType == "pocket square")){
					lineItems[i].unitPrice = bulkSquares;
					lineItems[i].linePrice = lineItems[i].unitPrice  *lineItems[i].quantity;
					$("#modified-unit-price-" + i).text(lineItems[i].unitPrice);
					$("#line-item-price-" + i).text(lineItems[i].linePrice);
				}
			}
			this.updateTotalPrice();
		},


		getBulkCount: function(){
			var lineItems = thisEstimate.lineItemsList;	
			var bulkCount = 0;
			var bulkSquares = 0;
			for (var i = lineItems.length - 1; i >= 0; i--) {
				productType = lineItems[i].product;
				if (lineItems[i].active && ((productType == "necktie") || (productType == "bow tie") || (productType =="scarf"))){
					bulkCount += lineItems[i].quantity;
				} else if (lineItems[i].active && (productType == "pocket square")){
					bulkSquares += lineItems[i].quantity;
				}
				
			}
			console.log("bulk count: " + bulkCount + ", bulk squares: " + bulkSquares);
			return {bulkCount: bulkCount, bulkSquares : bulkSquares};
		},
		setBulkRate: function(){
			var bulk = thisEstimate.getBulkCount();
			var bulkCount = bulk.bulkCount;
			var bulkSquares = bulk.bulkSquares;
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
				case bulkCount<100:
				bulkRate = 30;
				break;
				case bulkCount<500:
				bulkRate = 25;
				break;
				case bulkCount>499:
				bulkRate = 21;
				break;
			}
			switch (true) {
				case bulkSquares<50:
				bulkSquareRate = 15;
				break;
				case bulkSquares>49:
				bulkSquareRate = 10;
				break;
			}
			return {bulkRate: bulkRate, bulkSquares: bulkSquareRate};

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
			$(".quantity").on('keyup change', function(){
				lineid = this.getAttribute("data-lineid");
				thisEstimate.updateLineItem(lineid, "quantity", this.value);
				changedLineItem = thisEstimate.lineItemsList[lineid];
				newQuantity = parseInt(this.value) || 0;
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