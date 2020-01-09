var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var getBaseLog = function (x, y) { return Math.log(y) / Math.log(x); };
var Dice = /** @class */ (function () {
    function Dice() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.sides = args[0];
        this.multiplier = args[1];
    }
    Dice.prototype.getMult = function () {
        return this.multiplier;
    };
    Dice.prototype.roll = function () {
        return Math.floor(Math.random() * this.sides);
    };
    return Dice;
}());
var Trick = /** @class */ (function () {
    function Trick() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.rollsNeeded = __spreadArrays(args);
    }
    Trick.prototype.matchesTrick = function () {
        var _this = this;
        var roll = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            roll[_i] = arguments[_i];
        }
        var result = roll.every(function (val) { return _this.rollsNeeded.includes(val); });
        return result;
    };
    return Trick;
}());
var ace = new Trick(1);
var player = {
    money: 0,
    exp: 0,
    level: 1,
    dice: []
};
var startGame = function (player) {
    var startingDie = new Dice(3, 1);
    player.dice.push(startingDie);
};
var evaluateDice = function (dice) {
    var diceRolls = [];
    var salary = 0;
    var exp = 0;
    for (var _i = 0, dice_1 = dice; _i < dice_1.length; _i++) {
        var die = dice_1[_i];
        var roll = die.roll();
        diceRolls.push(roll);
        var score = roll * die.getMult();
        exp += die.getMult();
        salary += score;
    }
    return [salary, exp];
};
var evalTurn = function (player) {
    var result = evaluateDice(player.dice);
    player.money += result[0];
    player.exp += result[1];
};
var buyDie = function (player) {
    var cost = 25 * (Math.pow(2, player.dice.length) - 1);
    if (player.money >= cost) {
        player.money -= cost;
        player.dice.push(new Dice(3, 1));
    }
};
var calcLevel = function (exp) {
    var level = Math.floor(getBaseLog(2, exp));
    return level;
};
startGame(player);
for (var i = 0; i < 40; i++) {
    evalTurn(player);
    player.level = calcLevel(player.exp);
}
buyDie(player);
console.log(player);
console.log(ace);
//# sourceMappingURL=index.js.map