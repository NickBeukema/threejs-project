export const xPositive = 1;
export const xNegative = -1;
export const gridWidth = 64;
export const gridSubDiv = 16;

let minion = {
	baseHealth: 10,
	baseAttack: 3,
	baseAttackSpeed: 1000,
	upgrades: {
		health: {
			cost: 50,
			amount: 5
		},
		attack: {
			cost: 75,
			amount: 2
		},
		attackSpeed: {
			cost: 100,
			amount: 10
		}
	}
};

let base = {
	baseHealth: 250,
	upgrades: {
		health: {
			cost: 150,
			amount: 250,
		}
	}
};

let archer = {
	baseAttack: 1,
	baseAttackSpeed: 1000,
	baseArrowSpeed: 1000,
	upgrades: {
		attack: {
			cost: 50,
			amount: 1,
		},
		attackSpeed: {
			cost: 100,
			amount: 10,
		}
	}
}

let player = {

};

export default {minion, base, archer, player};