$( document ).ready(function() {

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

	thisEstimate = new Estimate([]);

	function LineItem (theIdentifier, theProduct) {
		this.active = true;
		this.quantity = 1;
		this.identifier = theIdentifier;
		this.product = theProduct.name;
		this.price = theProduct.basePrice;
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
				console.log(this.id);
				var str = this.id;
				var n = str.lastIndexOf('-');
				var result = str.substring(n + 1);
				thisEstimate.lineItemsList[result].active = false;
				$("#line-item-" + result).hide();
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