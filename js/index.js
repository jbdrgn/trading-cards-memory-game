class Game {
	constructor() {

		this.images = [
			'../img/bear_market_card.png',
			'../img/bitcoin_card.png',
			'../img/break_even_card.png',
			'../img/bull_market_card.png',
			'../img/buy_card.png',
			'../img/buy_sell_card.png',
			'../img/candles_card.png',
			'../img/ethereum_card.png',
			'../img/eurusd_card.png',
			'../img/gbpjpy_card.png',
			'../img/metatrader_card.png',
			'../img/stop_loss_card.png',
			'../img/sell_card.png',
			'../img/take_profit_card.png',
			'../img/trading_news_card.png',
			'../img/xagusd_card.png',
			'../img/xauusd_card.png'
		]

		//CONSTANTS
		this.ONE_THOUSAND_NUMBER = 1000
		this.movements_string = 'movements'

		this.items = []
		this.cards = new Array()
		this.cards_ids = new Array()
		this.current_level = 0
		this.level_squares = [10]
		this.chosen_card_one
		this.chosen_card_two
		this.chosen_cards = 0
		this.game_counter = 0
		this.movements = 0
		this.loading_container = document.getElementById('loading')
		this.movements_container = document.getElementById('movements')
		this.container = document.getElementById('game')
		this.is_running_time = true

		//Time
		this.first_movement = false
		this.hour = 0
		this.minutes = 0
		this.seconds = 0
		this.decimals = 0
		this.timer = ''
		this.stop = true
	}

	initGame() {
		this.current_level = 0
		this.choseCard = this.choseCard.bind(this)

		/*1.Sort the images, get only 10 and create the items*/
		this.images = this.sortRandomArray(this.images);
		this.items = this.createItems(
			this.getALimitQuantityOfCards(this.images, 10)
		);

		//TEST
		//console.log(this.items)

		/*2.create a list with the pair items ids*/
		this.items.forEach((card) => {
			this.cards_ids.push(card.id)
			this.cards_ids.push(card.id)
		});

		/*3.Sort the ids list randomly*/
		this.cards_ids = this.cards_ids.sort(function () {
			return Math.random() - 0.5
		})

		/*4.Create a container's card for each paired item*/
		this.cards_ids.forEach((id, index) => {
			var card = this.createCard(id, index, this.choseCard, this.items[id].image)
			this.cards.push(card)
			this.container.appendChild(card)
		})

		// 5.wait 1 second to loading container
		setTimeout(() => {
			this.loading_container.style.display = 'none'
			this.container.style.display = 'flex'
		}, this.ONE_THOUSAND_NUMBER)
	}

	capitalizeString(str) {
		return str.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	sortRandomArray(array) {
		return array.sort(() => Math.random() - 0.5)
	}

	getALimitQuantityOfCards(array, limit) {
		return array.slice(0, limit)
	}

	createItems(cards_list) {
		var items = []
		cards_list.forEach((path, index) => {
			var item = {
				'id': index,
				'name': path.split("/")[path.split("/").length - 1].split("_card.png")[0],
				'image': path
			}
			items.push(item);
		})
		return items
	}

	createCard(id, index, card_object, card_image) {
		var card = document.createElement('div')
		card.setAttribute('id', index)
		card.setAttribute('id_card', id)
		card.classList.add('card')
		card.innerText = id
		card.setAttribute('data-position', index)
		card.addEventListener('click', card_object)
		card.innerHTML =
			'<div class="front front_flip" data-position="' +
			index +
			'"></div><div class="back back_flip" data-position="' +
			index +
			'" style="background-image: url(' +
			card_image +
			');">' +
			'' +
			'</div>'
		return card
	}

	addClickEvent(n) {
		this.cards[n].addEventListener('click', this.choseCard)
	}

	removeClickEvent(n) {
		this.cards[n].removeEventListener('click', this.choseCard)
	}

	choseCard(e) {
		if (this.is_running_time === true) {
			switch (this.chosen_cards) {
				case 0:
					this.movements++
					this.movements_container.innerText = `Movimientos: ${this.movements}`

					if (!this.first_movement) {
						this.initCronometer()
					}
					this.first_movement = true
					this.chosen_card_one = e.target.dataset.position
					this.cards[this.chosen_card_one].classList.add('flip')
					this.removeClickEvent(this.chosen_card_one)
					this.chosen_cards++
					break
				case 1:
					this.movements++
					this.movements_container.innerText = `Movimientos: ${this.movements}`

					this.chosen_card_two = e.target.dataset.position
					this.cards[this.chosen_card_two].classList.add('flip')
					if (
						this.cards_ids[this.chosen_card_one] ===
						this.cards_ids[this.chosen_card_two]
					) {
						// console.log('Pair matched')
						this.removeClickEvent(this.chosen_card_two)
						this.game_counter++
						if (this.game_counter === this.level_squares[this.current_level]) {
							setTimeout(() => {
								this.endGame()
							}, this.ONE_THOUSAND_NUMBER)
						}
					} else {
						// console.log('Pair not matched')
						this.is_running_time = false
						setTimeout(() => {
							this.cards[this.chosen_card_one].classList.remove('flip')
							this.cards[this.chosen_card_two].classList.remove('flip')
							this.is_running_time = true
						}, this.ONE_THOUSAND_NUMBER)
						this.addClickEvent(this.chosen_card_one)
					}
					this.chosen_cards = 0
					break
			}
		}
	}

	endGame() {
		this.stopTimer()
		swal(
			'Victory!',
			`${this.capitalizeString(this.movements_string)}: ${this.movements} \n\n Time: ${this.timer}`,
			'success'
		).then(() => {
			console.log('') //Message after the SweetAlert is closed
		})
	}

	newGame() {
		location.reload()
	}

	//Cronometer
	initCronometer() {
		if (this.stop == true) {
			this.stop = false
			this.cronometer()
		}
	}

	cronometer() {
		if (this.stop == false) {
			this.decimals++
			if (this.decimals > 9) {
				this.decimals = 0
				this.seconds++
			}
			if (this.seconds > 59) {
				this.seconds = 0
				this.minutes++
			}
			if (this.minutes > 59) {
				this.minutes = 0
				this.hour++
			}
			this.showTimer()
			setTimeout('init.cronometer()', 100)
		}
	}

	showTimer() {
		if (this.hour < 10) this.timer = ''
		else this.timer = this.hour
		if (this.minutes < 10) this.timer = this.timer + '0'
		this.timer = this.timer + this.minutes + ':'
		if (this.seconds < 10) this.timer = this.timer + '0'
		this.timer = this.timer + this.seconds
		document.getElementById('timer').innerHTML = this.timer
	}

	stopTimer() {
		this.stop = true
	}
}

const init = new Game()
init.initGame()
