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
    ok(myLeaf.config.maxI == 6,"row with max width is 6");
    ok(myLeaf.config.elongation == 2, "elongation coefficient is 2")
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
    deepEqual(myLeaf.rows[0],{midY:0,marginY:0,marginX:1},"Initial row stays 0 across the board");
    deepEqual(myLeaf.rows[9],{midY:9.9,marginY:9.9,marginX:1},"Last row grows longer but width is 0");
    equal(Math.round(myLeaf.rows[6].marginX*100)/100, 1.1, "Widest width grows at full growth rate");
    equal(Math.round(myLeaf.rows[2].marginX*1000)/1000, 1.036, "Near the stem width grows less");
    equal(Math.round(myLeaf.rows[8].marginX*1000)/1000, 1.075, "Near the tip width grows less");
});

module("Config");
test( "Different elongation coefficient changes leaf shape", function() {
    var config = {
        elongation:3      //Affects global leaf shape
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
    deepEqual(myLeaf.rows[0],{midY:0,marginY:0,marginX:1},"Initial row stays 0 across the board");
    equal(Math.round(myLeaf.rows[9].marginY*10)/10,10.8,"Last row grows longer but width is 0");
    equal(Math.round(myLeaf.rows[6].marginX*100)/100, 1.2, "Widest width grows at full growth rate");
    equal(Math.round(myLeaf.rows[2].marginX*1000)/1000, 1.072, "Near the stem width grows less");
    equal(Math.round(myLeaf.rows[8].marginX*1000)/1000, 1.150, "Near the tip width grows less");

});

test( "Different choice of max leaf width has impact on leaf shape", function() {
    var config = {
        maxI:4
    };
    var myLeaf = new Leaf(config);
    equal( myLeaf.getTipDistanceMultiplier(0),0 , "Initial Row returns 0" );
    equal( myLeaf.getTipDistanceMultiplier(9),0 , "Last Row returns 0" );
    notEqual( myLeaf.getTipDistanceMultiplier(6), 1, "Row which isn't max width does not return 1");
    equal( myLeaf.getTipDistanceMultiplier(4), 1, "Row which is max width does return 1");
    equal( Math.round(myLeaf.getTipDistanceMultiplier(2)*100)/100,0.56, "Row 2 returns 0.56");
    equal( Math.round(myLeaf.getTipDistanceMultiplier(8)*100)/100,0.56, "Row 8 returns 0.56");

});