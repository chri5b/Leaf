/**
 * Created with JetBrains WebStorm.
 * User: chris
 * Date: 3/17/13
 * Time: 9:48 PM
 * To change this template use File | Settings | File Templates.
 */

module("After instantiation");
test("We should have a leaf object",function() {
    var myLeaf = new Leaf();

    ok(myLeaf.config.n == 10,"number of rows is configured to be 10");
    ok(myLeaf.rows.length == 10, "number of rows is actually 10");
    ok(myLeaf.config.Yd == 6,"row with max width is 6");
    ok(myLeaf.config.k == 2, "elongation coefficient is 2")
});

module("Tip Distance");
test( "getTipDistanceMultiplier()", function() {
    var myLeaf = new Leaf();
    ok( myLeaf.getTipDistanceMultiplier(0) == 0 , "Initial Row returns 0" );
    ok( myLeaf.getTipDistanceMultiplier(9) == 0 , "Last Row returns 0" );
    ok( myLeaf.getTipDistanceMultiplier(6) == 1, "Max width returns 1");
    ok( Math.round(myLeaf.getTipDistanceMultiplier(2)*100)/100 == 0.36, "Row 2 returns 0.36");
    ok( Math.round(myLeaf.getTipDistanceMultiplier(8)*100)/100 == 0.75, "Row 8 returns 0.75");

});

module("Grow leaf, grow");
test("grow()", function() {
    var myLeaf = new Leaf();
    myLeaf.grow();
    deepEqual(myLeaf.rows[0],{cellRowElongation:1,midY:0,marginY:0,marginX:1,minVeinDistance:3},"Initial row stays 0 across the board");
    equal(Math.round(myLeaf.rows[9].midY*100)/100,1.01,"Last row grows longer but width is 0");
    equal(Math.round(myLeaf.rows[6].marginX*100)/100, 1.06, "Widest width grows at full growth rate");
    equal(Math.round(myLeaf.rows[2].marginX*1000)/1000, 1.022, "Near the stem width grows less");
    equal(Math.round(myLeaf.rows[8].marginX*1000)/1000, 1.045, "Near the tip width grows less");
});

module("Config");
test( "Different elongation coefficient changes leaf shape", function() {
    var config = {
        k:3      //Affects global leaf shape
    };
    var myLeaf = new Leaf(config);
    ok( myLeaf.getTipDistanceMultiplier(0) == 0 , "Initial Row returns 0" );
    ok( myLeaf.getTipDistanceMultiplier(9) == 0 , "Last Row returns 0" );
    ok( myLeaf.getTipDistanceMultiplier(6) == 1, "Max width returns 1");
    equal( Math.round(myLeaf.getTipDistanceMultiplier(2)*100)/100,0.49, "Row 2 returns 0.49");
    equal( Math.round(myLeaf.getTipDistanceMultiplier(8)*1000)/1000 , 0.875, "Row 8 returns 0.875");
});

test( "Different growth factor coefficient changes leaf growth", function() {
    var config = {
        g:0.2
    };
    var myLeaf = new Leaf(config);
    myLeaf.grow();
    deepEqual(myLeaf.rows[0],{cellRowElongation:1,midY:0,marginY:0,marginX:1,minVeinDistance:3},"Initial row stays 0 across the board");
    equal(Math.round(myLeaf.rows[9].marginY*10)/10,1.1,"Last row grows longer but width is 0");
    equal(Math.round(myLeaf.rows[6].marginX*100)/100, 1.12, "Widest width grows at full growth rate");
    equal(Math.round(myLeaf.rows[2].marginX*1000)/1000, 1.044, "Near the stem width grows less");
    equal(Math.round(myLeaf.rows[8].marginX*1000)/1000, 1.091, "Near the tip width grows less");

});

test( "Different choice of max leaf width has impact on leaf shape", function() {
    var config = {
        Yd:4
    };
    var myLeaf = new Leaf(config);
    equal( myLeaf.getTipDistanceMultiplier(0),0 , "Initial Row returns 0" );
    equal( myLeaf.getTipDistanceMultiplier(9),0 , "Last Row returns 0" );
    notEqual( myLeaf.getTipDistanceMultiplier(6), 1, "Row which isn't max width does not return 1");
    equal( myLeaf.getTipDistanceMultiplier(4), 1, "Row which is max width does return 1");
    equal( Math.round(myLeaf.getTipDistanceMultiplier(2)*100)/100,0.56, "Row 2 returns 0.56");
    equal( Math.round(myLeaf.getTipDistanceMultiplier(8)*100)/100,0.56, "Row 8 returns 0.56");

});

module("Vein Distance")
test("Vein Distance", function() {
    var myLeaf = new Leaf();
    equal(myLeaf.rows[2].minVeinDistance,1,"Row before first vein calculates distance correctly");
    equal(myLeaf.rows[3].minVeinDistance,0,"Row which is a vein has min distance 0");
    equal(myLeaf.rows[5].minVeinDistance,2,"Row between veins calculates distance correctly");
    equal(myLeaf.rows[8].minVeinDistance,1,"Row after last vein calculates distance correctly");
});

test("Vein distance growth rate", function() {
    var myLeaf = new Leaf();
    equal(Math.round(myLeaf.calculateVeinDistanceMultiplier(0)*100)/100,0.26,"Row 3 away from vein has low growth");
    equal(myLeaf.calculateVeinDistanceMultiplier(3),1,"Row which is a vein has full growth");
    equal(Math.round(myLeaf.calculateVeinDistanceMultiplier(4)*100)/100,0.61,"Row 1 away from vein has pretty high growth");
});

test("Vein Distance Vein Distance Multiplier", function() {
    var myLeaf = new Leaf({veinDistanceB:1});
    equal(Math.round(myLeaf.calculateVeinDistanceMultiplier(0)*100)/100,0.22,"Row 3 away from vein has low growth");
    equal(myLeaf.calculateVeinDistanceMultiplier(3),1,"Row which is a vein has full growth");
    equal(Math.round(myLeaf.calculateVeinDistanceMultiplier(4)*100)/100,0.61,"Row 1 away from vein has pretty high growth");
});

test("Vein Distance Vein Distance Exponent", function() {
    var myLeaf = new Leaf({veinDistanceA:0.1});
    equal(Math.round(myLeaf.calculateVeinDistanceMultiplier(0)*100)/100,0.76,"Row 3 away from vein has low growth");
    equal(myLeaf.calculateVeinDistanceMultiplier(3),1,"Row which is a vein has full growth");
    equal(Math.round(myLeaf.calculateVeinDistanceMultiplier(4)*100)/100,0.9,"Row 1 away from vein has pretty high growth");
});