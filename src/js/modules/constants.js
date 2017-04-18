export const xPositive = 1;
export const xNegative = -1;
export const gridWidth = 64;
export const gridSubDiv = 16;
export const baseHealth = 200;
export const minionBaseHealth = 10;
export const minionBaseAttack = 3;
export const minionBaseAttackSpeed = 400;
export const archerBaseAttack = 1;
export const archerBaseAttackSpeed = 500;
export const baseHealthUpgradeAmount = 25;

let minion = {
	baseHealth: 10,
	baseAttack: 3,
	baseAttackSpeed: 800,
	upgrades: {
		health: {
			cost: 50,
			amount: 5
		},
		attack: {
			cost: 75,
			amount: .15
		},
		attackSpeed: {
			cost: 100,
			amount: 2
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
	baseAttackSpeed:500,
	upgrades: {
		attack: {
			cost: 50,
			amount: .15,
		},
		attackSpeed: {
			cost: 100,
			amount: .02,
		}
	}
}

let player = {

};

export default {minion, base, archer, player};