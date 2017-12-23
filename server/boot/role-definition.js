module.exports = function(app) {
  var User = app.models.User;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var Team = app.models.Team;
  

//   User.create([
//     {username: 'Executive', email: 'aravind.sekar1@cognizant.com', password: 'exec@wmk'},
//     {username: 'Manager', email: 'aravind.sekar2@cognizant.com', password: 'mgr@wmk'},
//     {username: 'Admin', email: 'aravind.sekar@cognizant.com', password: 'cts@wmk'}
//   ], function(err, users) {
//     if (err) throw err;

//     console.log('Created users:', users);
//     // create project 1 and make john the owner

//     //create the admin role
//     Role.create({
//       name: 'admin'
//     }, function(err, role) {
//       if (err) throw err;

//       console.log('Created role:', role);

//       //make bob an admin
//       role.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: users[2].id
//       }, function(err, principal) {
//         if (err) throw err;

//         console.log('Created principal:', principal);
//       });
//     });

//   });

};
