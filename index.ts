const getBaseLog = (x, y) => Math.log(y) / Math.log(x)

class Dice {
    sides: number;
    multiplier: number;
    constructor (...args) {
        this.sides = args[0];
        this.multiplier = args[1];
    }
    public getMult() {
        return this.multiplier;
    }
    public roll() {
        return (Math.floor(Math.random() * this.sides) + 1);
    }
}

class Trick {
    name: string;
    rollsNeeded: number[];
    multiplier: number;
    timesPlayed: number;
    constructor (...args) {
        this.name = args[0];
        this.multiplier = args[1];
        this.timesPlayed = 0;
        this.rollsNeeded = [...args];
        this.rollsNeeded.shift();
        this.rollsNeeded.shift();
    }
    public getName() {
        return this.name;
    }
    public getMult() {
        return this.multiplier;
    }
    public matchesTrick(rl) {
        let roll = [...rl];
        let drolls = [...this.rollsNeeded];
        let indices = [];
        let repeat = false;
        do {
            repeat = false;
            console.log(drolls);
            console.log(roll);
            for (let i:number = 0; i < drolls.length; i++) {
                for (const j in roll) {
                    // console.log(drolls[i] + "|" + roll[j]);
                    if (drolls[i] === roll[j]) {
                        console.log("Roll again!");
                        indices.push(Number(j));
                        roll[j] = null;
                        drolls.shift();
                        this.timesPlayed++;
                        repeat = true;
                        i--;
                        break;
                    }
                }
            }
        } while (repeat === true);
        indices.map(l => Number(l));
        // console.log(indices);
        if (drolls.length == 0) {
            return [true, indices];
        } else {
            return [false];
        }
    }
}

class Level {
    lnum: number;
    reward: Trick;
    unlocked: boolean;
    constructor(...args) {
        this.lnum = args[0];
        this.reward = args[1];
        this.unlocked = false;
    }
    public unlock(player) {
        if (player.level >= this.lnum && this.unlocked == false) {
            player.tricks.push(this.reward);
            this.unlocked = true;
            console.log("You have unlocked " + this.reward.getName() + "!");
        }
    }
}

const ace = new Trick("Ace", 2, 1);
const dueces = new Trick("Dueces", 2, 2, 2);
const minifib = new Trick("Microfib", 2, 1, 1, 2);
const triples = new Trick("Triples", 3, 3, 3, 3);
const ministr = new Trick("Mini Straight", 2, 1, 2, 3);
const infocode = new Trick("Information", 4, 4, 1, 1);
const fours = new Trick("Four Four", 4, 4, 4, 4, 4);

const tricks = [ace, dueces, minifib];

interface Player {
    turnsleft: number,
    money: number,
    exp: number,
    level: number,
    levels: Level[],
    dice: Dice[],
    tricks: Trick[];
}

const player = {
    turnsleft: 10,
    money: 0,
    exp: 0,
    level: 1,
    levels: [],
    tricks: [

    ],
    dice: [

    ]
}

const startGame = (player: Player) => {
    const startingDie = new Dice(3, 1);
    player.dice.push(startingDie);
    player.dice.push(startingDie);
    player.dice.push(startingDie);
    player.dice.push(startingDie);
    for (const i in tricks) {
        const newLevel = new Level(Number(i) + 1, tricks[i]);
        player.levels.push(newLevel);
    }
}

const evaluateDice = (tricks: Trick[], dice: Dice[]) => {
    let diceRolls: number[] = [];
    let salary: number = 0;
    let bsal: number = 0;
    let exp: number = 0;
    for (const die of dice) {
        const roll = die.roll();
        diceRolls.push(roll);
        const score = roll * die.getMult();
        exp += die.getMult();
        salary += score;
    }
    console.log(diceRolls);
    bsal = salary;
    for (const trick of tricks) {
        const matchRes: Array<any> = trick.matchesTrick(diceRolls)
        // console.log(trick);
        // console.log(matchRes);
        // console.log(matchRes[0]);
        if (matchRes[0] === true) {
            let sum: number = 0;
            for (let i = 0; i < matchRes[1].length; i++) {
                sum += dice[matchRes[1][i]].getMult() * diceRolls[matchRes[1][i]];
            }
            sum *= trick.getMult();
            console.log("You rolled a " + trick.getName() + ". +" + sum);
            salary += sum;
        }
    }
    console.log("Salary: " + bsal);
    console.log("Total income: " + salary);
    return [salary, exp];
}

const evalTurn = (player: Player) => {
    if (player.turnsleft <= 0) {
        console.log("You do not have any turns left!");
        return;
    }
    const result = evaluateDice(player.tricks, player.dice);
    player.money += result[0];
    player.exp += result[1];
    player.level = calcLevel(player.exp);
    player.turnsleft--;
    console.log("Money: " + player.money);
    console.log("Exp: " + player.exp + "|" + player.level);
    console.log(`You have ${player.turnsleft} turns left.`);
}

const buyDie = (player: Player) => {
    const cost = 25 * (2 ** player.dice.length - 1);
    if (player.money >= cost) {
        player.money -= cost;
        player.dice.push(new Dice(3, 1));
    }
}

const calcLevel = (exp: number) => {
    const level = Math.floor(getBaseLog(2, exp));
    for (let value of player.levels) {
        value.unlock(player);
    }
    return level;
}

startGame(player);
evalTurn(player);
evalTurn(player);
console.log(player);