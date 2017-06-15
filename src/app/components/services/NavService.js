(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'Log',
        icon: 'description',
        sref: '.logs'
      },
      {
        name: 'Log Overview',
        icon: 'dashboard',
        sref: '.dashboard'
      },
      {
        name: 'Prediction',
        icon: 'timeline',
        sref: '.prediction'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
