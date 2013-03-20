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
    if(!this.config.R) {
        this.config.R = 1.2;
    }
    if(!this.config.Yd) {
        this.config.Yd = 6;
    }
    if(!this.config.k) {
        this.config.k = 2;
    }
    if(!this.config.veins) {
        this.config.veins = [3,7];
    }
    if(this.config.veinDistanceA==undefined) {
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
        newRow.cellRowElongation = 1;
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
    } else if (index == this.config.Yd) {
        return 1;
    } else if (index > this.config.Yd) {
        return this.getLateTipDistanceMultiplier(index);
    } else if (index < this.config.Yd) {
        return this.getEarlyTipDistanceMultiplier(index);
    } else {
        return 0;
    }
};


Leaf.prototype.getEarlyTipDistanceMultiplier = function(index) {
    var numerator =  this.config.Yd - index;
    var denominator = this.config.Yd - 1;
    var fraction = numerator/denominator;
    var exponentedFraction = Math.pow(fraction,this.config.k);
    return Math.abs(1 - exponentedFraction);
};

Leaf.prototype.getLateTipDistanceMultiplier = function(index) {
    var numerator = index - this.config.Yd;
    var denominator = this.rows.length - this.config.Yd;
    var fraction = numerator/denominator;
    var exponentedFraction = Math.pow(fraction,this.config.k);
    return Math.abs(1 - exponentedFraction);
};

Leaf.prototype.grow = function() {
    for (var i = 0 ; i < this.rows.length; i++) {
        var deltaY = this.rows[i].midY * (this.config.g * this.config.R);
        this.rows[i].midY = this.rows[i].midY + deltaY;
        var deltaRowElongation = this.rows[i].cellRowElongation * (this.config.g * this.getTipDistanceMultiplier(i) * this.calculateVeinDistanceMultiplier(i));
        this.rows[i].cellRowElongation = this.rows[i].cellRowElongation + deltaRowElongation;
        if(this.config.slope == 0) {
            this.rows[i].marginY = this.rows[i].midY;
            this.rows[i].marginX = this.rows[i].marginX + deltaRowElongation;
        } else {
            var deltaX = deltaRowElongation / Math.pow((1 + (this.config.slope*this.config.slope)),0.5);
            this.rows[i].marginX = this.rows[i].marginX + deltaX;
            this.rows[i].marginY = this.rows[i].marginY + deltaY + this.config.slope*deltaX;
        }
    }
};

Leaf.prototype.calculateMinVeinDistances = function() {
    var nextVeinIndex = 0;
    var prevVeinIndex = null;
    var numVeins = this.config.veins.length;
    for(var i = 0 ; i < this.rows.length ; i++) {
        if (numVeins == 0) {
            this.rows[i].minVeinDistance = 0;
        } else {
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
}

Leaf.prototype.calculateVeinDistanceMultiplier = function(index) {
    var poweredVeinDistance = Math.pow(this.rows[index].minVeinDistance,this.config.veinDistanceB);
    var multipliedVeinDistance = -this.config.veinDistanceA * poweredVeinDistance;

    return Math.exp(multipliedVeinDistance);
}