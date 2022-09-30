const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 15;
const MONSTER_ATTACK_VALUE = 10;
const HEAL_VALUE = 5;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];

function getMaxLifeValue() {
	const enteredValue = parseInt(
		prompt("Maximum life for you and the monster.", "100")
	);
	if (isNaN(enteredValue) || enteredValue <= 0) {
		throw { message: "Invalid user input, Please enter a number." };
	}
	return enteredValue;
}

let chosenMaxLife;

try {
	chosenMaxLife = getMaxLifeValue();
} catch (error) {
	console.log(error);
	chosenMaxLife = 100;
	alert("Please enter a number as a lifespan.");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
	let logEntry = {
		event: event,
		value: value,
		monsterHealth: monsterHealth,
		playerHealth: playerHealth,
	};

	switch (event) {
		case LOG_EVENT_PLAYER_ATTACK:
			logEntry.target = "MONSTER";
			break;
		case LOG_EVENT_PLAYER_STRONG_ATTACK:
			logEntry.target = "MONSTER";
			break;
		case LOG_EVENT_MONSTER_ATTACK:
			logEntry.target = "PLAYER";
			break;
		case LOG_EVENT_PLAYER_HEAL:
			logEntry.target = "PLAYER";
			break;
		case LOG_EVENT_GAME_OVER:
			logEntry;
			break;
		default:
			logEntry = {};
	}
	battleLog.push(logEntry);
}

function reset() {
	currentMonsterHealth = chosenMaxLife;
	currentPlayerHealth = chosenMaxLife;
	resetGame(chosenMaxLife);
}

function endRound() {
	const initialPlayerHealth = currentPlayerHealth;
	const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= playerDamage;
	writeToLog(
		LOG_EVENT_MONSTER_ATTACK,
		playerDamage,
		currentMonsterHealth,
		currentPlayerHealth
	);

	if (currentPlayerHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		removeBonusLife();
		currentPlayerHealth = initialPlayerHealth;
		setPlayerHealth(initialPlayerHealth);
		alert("You got a bonus life!");
	}

	if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert("You won!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"PLAYER WON!",
			currentMonsterHealth,
			currentPlayerHealth
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
		alert("You lost!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"MONSTER WON!",
			currentMonsterHealth,
			currentPlayerHealth
		);
	} else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
		alert("Match Draw!");
		writeToLog(
			LOG_EVENT_GAME_OVER,
			"THAT WAS A DRAW!",
			currentMonsterHealth,
			currentPlayerHealth
		);
	}

	if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
		reset();
	}
}

function attackMonster(mode) {
	const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
	const logEvent =
		mode === MODE_ATTACK
			? LOG_EVENT_PLAYER_ATTACK
			: LOG_EVENT_PLAYER_STRONG_ATTACK;
	const damage = dealMonsterDamage(maxDamage);
	currentMonsterHealth -= damage;
	writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
	endRound();
}

function attackHandler() {
	attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
	attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
	let healValue;
	if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
		alert("You can't heal more!");
		healValue = chosenMaxLife - currentPlayerHealth;
	} else {
		healValue = HEAL_VALUE;
	}
	increasePlayerHealth(HEAL_VALUE);
	currentPlayerHealth += HEAL_VALUE;
	writeToLog(
		LOG_EVENT_PLAYER_HEAL,
		healValue,
		currentMonsterHealth,
		currentPlayerHealth
	);
	endRound();
}

function printLogHandler() {
	for (let i = 0; i < battleLog.length; i++) {
		console.log(battleLog[i]);
	}
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
