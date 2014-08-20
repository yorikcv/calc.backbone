$(function(){

	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};
	// App.Models.Control = Backbone.Model.extend();

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
		
		validateResult: function(result) {
			return (result > 100) ? false : true;			
		},

		setResult: function(value) {
			if (this.validateResult()) {
				this.set('result', value);
			}			
		},

		getResult: function() {
			return this.get('result');
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
		},

		delete: function () {
			this.destroy();
		}

	});

	// colection of calculations

	App.Collections.Сalculation = Backbone.Collection.extend({
		model: App.Models.Сalculation
	});

	//View for calculation

	App.Views.Сalculation = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#templateli').html()),


		initialize: function () {		 
			 
		},

		events: {
			'click .delete': 'destroy'
		},

		render: function () {
			this.model.calc();
		 	console.log(this.model);
			this.$el.html( this.template( this.model.toJSON() ) );
			this.attachEvents();
			return this;
		},

		attachEvents: function() {
			this.model.on('destroy', this.remove, this);
			this.$('.delete').on('click', _.bind(this.destroy, this));
		},

		destroy: function () {
			console.log("yyyeeee");
			this.remove();
		}

	});
	
	//view for calculations of colection

	// calculation = new App.Models.Сalculation();

	App.Views.HistoryCollections = Backbone.View.extend({
		tagName: 'ul',
		id: 'historyUl',

		initialize: function () {
			this.render();
			this.collection.on('add', this.add, this);
		},

		render: function () {

			// this.$el.empty();
			this.collection.each(function (num) {
				var calculationView = new App.Views.Сalculation({model: num});
								

				this.$el.append(calculationView.render().el);
				//console.log(calculationView.el);
			}, this);

			$('#history').html(this.el);

			return this;
		}, 

		add: function () {
			var calculationView = new App.Views.Сalculation({model: this.collection.last()});
			this.$el.append(calculationView.render().el);
			$('#history').append(this.el);
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
        display: $("#display"),

        initialize: function(){
        	this.$('.numbers').on('click', this.numbersClick);
        	this.$('.operations').click(this.operationsClick);
        	this.$('.equal').click(this.equalClick);
        	this.$('.clear').click(this.clearClick);
        	//this.$el.on('click .numbers', this.numbersClick);
        },

        events : {
        	'click .numbers': 'numbersClick'
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
	
	window.calculationCollection = new App.Collections.Сalculation([{firstNumber: 4, secondNumber: 5, operand: '+'},{firstNumber: 6, secondNumber: 5, operand: '-'}]);

	historyView = new App.Views.HistoryCollections({collection: calculationCollection});
	controlView = new App.Views.Control({});


	// 	window.calculation = new App.Models.Сalculation({firstNumber: 2, operand: "*", secondNumber: 1});
	// window.calcView = new App.Views.Сalculation({model: calculation});

    

	
});



