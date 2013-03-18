/**
 * Created with JetBrains WebStorm.
 * User: chris
 * Date: 3/17/13
 * Time: 8:44 PM
 * To change this template use File | Settings | File Templates.
 */
function Leaf(config) {

    if(config) {
        this.config = config;
    } else {
        this.config={};
    }

    // set defaults if not specified in config parameter
    if(!this.config.n) {
        this.config.n = 10;
    }
    if(!this.config.g) {
        this.config.g = 0.1;
    }
    if(!this.config.maxI) {
        this.config.maxI = 6;
    }
    if(!this.config.elongation) {
        this.config.elongation = 2;
    }
    if(!this.config.veins) {
        this.config.veins = [3,7];
    }
    if(!this.config.veinDistanceA) {
        this.config.veinDistanceA = 0.5;
    }
    if(!this.config.veinDistanceB) {
        this.config.veinDistanceB = 0.9;
    }
    if(!this.config.slope) {
        this.config.slope = 0;
    }

    this.rows = [];

    for (var i = 0; i < this.config.n ; i++) {
        var newRow = {};
        newRow.midY=i/this.config.n;
        newRow.marginX=1;
        newRow.marginY=i/this.config.n;
        this.rows.push(newRow);
    }

    this.calculateMinVeinDistances();

}

Leaf.prototype.getTipDistanceMultiplier = function(index) {

    //Manages calculations to ensure overall oval shape of leaf

    if (index==0 || index == this.rows.length - 1) {
        return 0;
    } else if (index == this.config.maxI) {
        return 1;
    } else if (index > this.config.maxI) {
        return this.getLateTipDistanceMultiplier(index);
    } else if (index < this.config.maxI) {
        return this.getEarlyTipDistanceMultiplier(index);
    } else {
        return 0;
    }
};


Leaf.prototype.getLateTipDistanceMultiplier = function(index) {
    var numerator = index - this.config.maxI;
    var denominator = this.config.n - this.config.maxI;
    var fraction = numerator/denominator;
    var exponentedFraction = Math.pow(fraction,this.config.elongation);
    return 1 - exponentedFraction;
};

Leaf.prototype.getEarlyTipDistanceMultiplier = function(index) {
    var numerator = this.config.maxI - index;
    var denominator = this.config.maxI - 1;
    var fraction = numerator/denominator;
    var exponentedFraction = Math.pow(fraction,this.config.elongation);
    return 1 - exponentedFraction;
};

Leaf.prototype.grow = function() {
    for (var i = 0 ; i < this.rows.length; i++) {
        this.rows[i].midY = this.rows[i].midY * (1+this.config.g);
        this.rows[i].marginX = this.rows[i].marginX * ( 1 + (this.config.g * this.getTipDistanceMultiplier(i)));
        this.rows[i].marginY = this.rows[i].marginY * ( 1 + this.config.g);
    }
};

Leaf.prototype.calculateMinVeinDistances = function() {
    var nextVeinIndex = 0;
    var prevVeinIndex = null;
    for(var i = 0 ; i < this.rows.length ; i++) {

        if(i == this.config.veins[nextVeinIndex]) {
            this.rows[i].minVeinDistance = 0;
            //We've hit a vein, so update our pointers to previous and next veins
            prevVeinIndex = nextVeinIndex;
            if(nextVeinIndex<this.config.veins.length-1) {
                //If there is a next vein - update pointer to it
                nextVeinIndex ++;
            } else {
                nextVeinIndex = null;
            }
        } else {
            //calculate distance to nearest veins, taking into account that you might be before the first one or after the last one
            if(nextVeinIndex!=null&&prevVeinIndex!=null) {
                this.rows[i].minVeinDistance = Math.min(Math.abs(this.config.veins[nextVeinIndex] - i),Math.abs(i - this.config.veins[prevVeinIndex]));
            } else if (nextVeinIndex!=null&&prevVeinIndex==null) {
                this.rows[i].minVeinDistance = Math.abs(this.config.veins[nextVeinIndex] - i)
            } else if (nextVeinIndex==null&&prevVeinIndex!=null) {
                this.rows[i].minVeinDistance = Math.abs(i - this.config.veins[prevVeinIndex])
            }

        }
    }
}

Leaf.prototype.calculateVeinDistanceMultiplier = function(index) {
    var multipliedVeinDistance = this.config.veinDistanceA * this.rows[index].minVeinDistance;
    var poweredVeinDistance = Math.pow(multipliedVeinDistance,this.config.veinDistanceB);
    return Math.exp(poweredVeinDistance*-1);
}