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

const enteredValue = parseInt(
	prompt("Maximum life for you and the monster.", "100")
);

let chosenMaxLife = 100;
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
	chosenMaxLife = 100;
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
	if (event === LOG_EVENT_PLAYER_ATTACK) {
		logEntry.target = "MONSTER";
	} else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
		logEntry.target = "MONSTER";
	} else if (event === LOG_EVENT_MONSTER_ATTACK) {
		logEntry.target = "PLAYER";
	} else if (event === LOG_EVENT_PLAYER_HEAL) {
		logEntry.target = "PLAYER";
	} else if (event === LOG_EVENT_GAME_OVER) {
		logEntry;
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
	let maxDamage;
	let logEvent;
	if (mode === MODE_ATTACK) {
		maxDamage = ATTACK_VALUE;
		logEvent = LOG_EVENT_PLAYER_ATTACK;
	} else if (mode === MODE_STRONG_ATTACK) {
		maxDamage = STRONG_ATTACK_VALUE;
		logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
	}
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
	console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
