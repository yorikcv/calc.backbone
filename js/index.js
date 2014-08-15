$(function(){

	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};
	App.Models.Control = Backbone.Model.extend();

	//model of one calculation
	App.Models.Сalculation = Backbone.Model.extend({
		defaults: {
			firstNumber: 0,
			operand: '+',
			secondNumber: 1,
			result: 0
		},

		add: function () {
			this.set({result: this.get('firstNumber') + this.get('secondNumber')});
			return this.get('result')
		},

		sub: function () {
			this.set({result: this.get('firstNumber') - this.get('secondNumber')});
			return this.get('result')
		},

		mul: function () {
			this.set({result: this.get('firstNumber') * this.get('secondNumber')});
			return this.get('result')
		},

		div: function () {
			this.set({result: this.get('firstNumber') / this.get('secondNumber')});
			return this.get('result')
		},

		calc: function () {
			if(this.get('operand') == "+") this.add();
			if(this.get('operand') == "-") this.sub();
			if(this.get('operand') == "*") this.mul();
			if(this.get('operand') == "/") this.div();
		}

	});

	// colection of calculations

	App.Collections.Сalculation = Backbone.Collection.extend({
		model: App.Models.Сalculation
	});

	//View for calculation

	App.Views.Сalculation = Backbone.View.extend({
		tagName: 'li',
		template: _.template('<%= firstNumber %> <%= operand %> <%= secondNumber %> = <%= result %> <button class="delete">Delete</button>'),


		initialize: function () {
		 this.render();
		 this.model.on('destroy', this.remove, this);

		},

		render: function () {
			this.model.calc();
			// console.log(this.model);
			this.$el.html( this.template( this.model.toJSON() ) );

		},

		events:{
			'click .delete' : 'destroy'
		},

		destroy: function () {
			console.log(this.model);
			this.model.destroy();
		},

		remove: function () {
			this.$el.remove();
		}

	});
	
	//view for calculations of colection

	calculation = new App.Models.Сalculation();

	App.Views.HistoryCollections = Backbone.View.extend({
		tagName: 'ul',
		id: 'historyUl',

		initialize: function () {
			this.render();
			this.collection.on('add', this.render, this);
		},

		render: function () {

			this.$el.empty();
			this.collection.each(function (num) {
				calculation=this.collection.get(num);
				var calculationView = new App.Views.Сalculation({model: calculation});
								

				this.$el.append(calculationView.el);
			}, this);

			$('#history').html(this.el);

			return this;
		}
	});


	var display = $("#display");
	var numbers = '';
	var firstNumber = '';
	var secondNumber = '';
	var operand = '';
	var result = '';


    App.Views.Control = Backbone.View.extend({
        el: '.container',

        initialize: function(){
        	$('.numbers').click(this.numbersClick);
        	$('.operations').click(this.operationsClick);
        	$('.equal').click(this.equalClick);
        	$('.clear').click(this.clearClick);
        	//this.$el.on('click .numbers', this.numbersClick);
        },

        render: function() {
        	
        },

        numbersClick: function () {
        	if(result == 1) {display.val(''); result = '';}
			numbers += $(this).text();
			display.val(display.val() + $(this).text());
        },
        operationsClick: function () {
        	 if(operand == '')
			{
				firstNumber = +(numbers);
				if(firstNumber != '')
				{					
					numbers = '';
					operand = $(this).text();
				display.val(display.val() + $(this).text());

					//console.log(numbers + "ope" + operand);
				}
			}

        },
        equalClick: function () {
        	secondNumber = +(numbers);
			numbers = '';

			var calculationAdd = new App.Models.Сalculation({firstNumber: firstNumber, secondNumber: secondNumber, operand: operand});
			calculationCollection.add(calculationAdd);

			display.val(calculationAdd.get('result'));

			
			operand = '';
			result = 1;

        },
        clearClick: function () {
        	display.val('');

			firstNumber = '';
			secondNumber = '';
			operand = '';
			numbers = '';

        }

        // events:{
        // 	'click .numbers' : 'numbersClick'
        // }


    });
	
	calculationCollection = new App.Collections.Сalculation([{firstNumber: 4, secondNumber: 5, operand: '+'}]);

	historyView = new App.Views.HistoryCollections({collection: calculationCollection});
	controlView = new App.Views.Control({});


	// 	window.calculation = new App.Models.Сalculation({firstNumber: 2, operand: "*", secondNumber: 1});
	// window.calcView = new App.Views.Сalculation({model: calculation});

    

	
});



