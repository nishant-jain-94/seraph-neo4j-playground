/* jshint esversion: 6 */
const should = require('should');
const db = require('seraph')({ user: "neo4j", pass: "password@123" });
const async = require('async');

var Shakespeare = { name: 'Shakespeare', age: 40 };
var AnnaHatheway = { name: 'AnnaHatheway', age: 42 };

describe('Create nodes', function () {
    it('Should create a Shakespeare and AnnaHatheway nodes', function (done) {
        async.parallel([
            function (callback) {
                db.save(Shakespeare, function (error, savedNode) {
                    // console.log(error);
                    Shakespeare.id = savedNode.id;
                    should(error).be.null();
                    savedNode.name.should.be.exactly(Shakespeare.name);
                    savedNode.age.should.be.exactly(Shakespeare.age);
                    savedNode.id.should.not.be.null();
                    callback(error, savedNode);
                });
            },
            function (callback) {
                db.save(AnnaHatheway, function (error, savedNode) {
                    AnnaHatheway.id = savedNode.id;
                    should(error).be.null();
                    savedNode.name.should.be.exactly(AnnaHatheway.name);
                    savedNode.age.should.be.exactly(AnnaHatheway.age);
                    savedNode.id.should.not.be.null();
                    callback(error, savedNode);
                });
            }
        ], function (error, results) {
            should(error).be.null();
            results.should.be.instanceOf(Array);
            results.length.should.be.exactly(2);
            results[0].name.should.be.exactly(Shakespeare.name);
            results[0].age.should.be.exactly(Shakespeare.age);
            results[0].id.should.be.exactly(Shakespeare.id);
            results[1].name.should.be.exactly(AnnaHatheway.name);
            results[1].age.should.be.exactly(AnnaHatheway.age);
            results[1].id.should.be.exactly(AnnaHatheway.id);
            done();
        });
    });
});


describe('Find Shakespeare and AnnaHatheway', function () {
    it('Should find Shakespeare and AnnaHatheway', function (done) {
        async.series([
            function (callback) {
                var predicate = { name: 'Shakespeare' };
                db.find(predicate, function (error, foundNode) {
                    should(error).be.null();
                    should(foundNode).not.be.null();
                    foundNode.should.be.instanceOf(Array);
                    foundNode.length.should.be.exactly(1);
                    foundNode[0].id.should.be.exactly(Shakespeare.id);
                    foundNode[0].name.should.be.exactly(Shakespeare.name);
                    foundNode[0].age.should.be.exactly(Shakespeare.age);
                    callback(error, foundNode);
                });
            },
            function (callback) {
                console.log(AnnaHatheway);
                var predicate = { name: 'AnnaHatheway' };
                db.find(predicate, function (error, foundNode) {
                    should(error).be.null();
                    should(foundNode).not.be.null();
                    console.log(foundNode);
                    foundNode.should.be.instanceOf(Array);
                    foundNode.length.should.be.exactly(1);
                    foundNode[0].id.should.be.exactly(AnnaHatheway.id);
                    foundNode[0].name.should.be.exactly(AnnaHatheway.name);
                    foundNode[0].age.should.be.exactly(AnnaHatheway.age);
                    callback(error, foundNode);
                });
            }
        ], done);
    });
});


describe('Find the nodes and add labels to these nodes', function() {
   it('Should add labels to the Shakespeare and AnnaHatheway nodes', function(done) {
      async.parallel([
          function(callback) {
              var predicate = {name: 'Shakespeare'};
              db.find(predicate, function(error,foundNode) {
                 should(error).be.null();
                 should(foundNode).not.be.null();
                 foundNode.should.be.instanceOf(Array);
                 foundNode.length.should.be.exactly(1);
                 foundNode[0].id.should.be.exactly(Shakespeare.id);
                 foundNode[0].name.should.be.exactly(Shakespeare.name);
                 foundNode[0].age.should.be.exactly(Shakespeare.age);
                 db.label(foundNode,['Shakespeare','Writer','Concept-Person'], function(error) {
                    should(error).be.null();
                    callback(error); 
                 });
              });
          },
          function(callback) {
              var predicate = {name: 'AnnaHatheway'};
              db.find(predicate, function(error,foundNode) {
                 should(error).be.null();
                 should(foundNode).not.be.null();
                 foundNode.should.be.instanceOf(Array);
                 foundNode.length.should.be.exactly(1);
                 foundNode[0].id.should.be.exactly(AnnaHatheway.id);
                 foundNode[0].name.should.be.exactly(AnnaHatheway.name);
                 foundNode[0].age.should.be.exactly(AnnaHatheway.age);
                 db.label(foundNode,['Concept-Person'], function(error) {
                    should(error).be.null();
                    callback(error); 
                 });
              });
          }
      ],done); 
   });
});


describe('Find the nodes using labels',function() {
   it('Should find all the nodes matching the label Person', function(done) {
      db.nodesWithLabel('Concept-Person',function(error,foundNodes) {
         should(error).be.null();
         foundNodes.should.not.be.null();
         foundNodes.should.be.instanceOf(Array);
         foundNodes.length.should.be.exactly(2);
         done();
      });
   });
});

describe('Find the nodes and relate them', function() {
    it('Should find Shakespeare and AnnaHatheway and relate them as married', function(done) {
        async.parallel([
            function(callback) {
                var predicate = {name:'Shakespeare'};
                db.find(predicate, function(error,foundNode) {
                    should(error).be.null();
                    should(foundNode).not.be.null();
                    foundNode.should.be.instanceOf(Array);
                    foundNode.length.should.be.exactly(1);
                    foundNode[0].id.should.be.exactly(Shakespeare.id);
                    foundNode[0].name.should.be.exactly(Shakespeare.name);
                    foundNode[0].age.should.be.exactly(Shakespeare.age);
                    callback(error,foundNode);
                });
            },
            function(callback) {
                var predicate = {name:'AnnaHatheway'};
                db.find(predicate, function(error,foundNode) {
                    should(error).be.null();
                    should(foundNode).not.be.null();
                    foundNode.should.be.instanceOf(Array);
                    foundNode.length.should.be.exactly(1);
                    foundNode[0].id.should.be.exactly(AnnaHatheway.id);
                    foundNode[0].name.should.be.exactly(AnnaHatheway.name);
                    foundNode[0].age.should.be.exactly(AnnaHatheway.age);
                    callback(error,foundNode);
                });
            }
        ], function(error,foundNodes) {
            should(error).be.null();
            should(foundNodes).not.be.null();
            foundNodes.should.be.instanceOf(Array);                        
            foundNodes.length.should.be.exactly(2);
            db.relate(foundNodes[0],'marriedTo',foundNodes[1], function(error,relationship) {
               should(error).be.null();
               should(relationship).not.be.null();
               relationship.should.be.instanceOf(Array);
               relationship[0].start.should.be.exactly(foundNodes[0].id);
               relationship[0].end.should.be.exactly(foundNodes[1].id);
               relationship[0].id.should.not.be.null();
               relationship[0].type.should.be.exactly('marriedTo');
               done(); 
            });
        });    
    });
});



// describe('Find the nodes created and add labels to these nodes', function () {
//     it('Should add labels to the testman nodes', function (done) {
//         async.parallel([
//             function (callback) {
//                 db.find(predicate, function (error, foundNode) {
//                     should(error).be.null();
//                     should(foundNode).not.be.null();
//                     foundNode.length.should.be.exactly(1);
//                     foundNode[0].id.should.be.exactly(Shakespeare.id);
//                     foundNode[0].name.should.be.exactly(Shakespeare.name);
//                     foundNode[0].age.should.be.exactly(Shakespeare.age);
//                     db.label(foundNode, ['Shakespeare', 'Writer'], function (error) {
//                         should(error).be.null();
//                         callback(error);
//                     });
//                 },
//                     function (callback) {

//                     }
 
           
//         ], function (error, callback) {

//             });
//     });

// });

// describe('Relate Nodes', function () {
//     it('Should Relate Nodes', function (done) {
//         db.relate(test_man_1, 'knows', test_man_2, { for: '2 Months' }, function (error, relationship) {
//             console.log("Printing Relationships", relationship);
//             done();
//         });
//     });
// });

// describe('Delete the node created', function () {
//     it('Should find for the new node created', function (done) {
//         let predicate = { name: 'Test-Man' };
//         db.find(predicate, function (error, foundNode) {
//             should(error).be.null();
//             foundNode[0].id.should.be.exactly(test_man_1.id);
//             foundNode[0].name.should.be.exactly(test_man_1.name);
//             foundNode[0].age.should.be.exactly(test_man_1.age);
//             if (!error) {
//                 db.delete(foundNode, function (error) {
//                     should(error).be.null();
//                     done();
//                 });
//             }
//         });
//     });
// });






