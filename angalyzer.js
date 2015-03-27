'use strict';

var Angalyzer = function() {
  var app = window.app;
  var angular = window.angular;
  var $injector = angular.injector();
  var appModel = {};

  this.app = function getApp() {
    return app;
  };

  this.appModel = function getAppModel() {
    return appModel;
  };

  this.angular = function getAngular() {
    return angular;    
  };

  this.injector = function getInjector() {
    return $injector;
  };
}


Angalyzer.prototype.crawlApp = function crawlApp() {
  var appModel = this.appModel();
  var injector = this.injector(); 
  this.types = {controller: [], factory: [], app: ['app'], lib: this.app().requires};
  appModel.app = this.app().requires;
  var invokeQueue = app._invokeQueue;
  var len = invokeQueue.length;
  for(var n=0; n < len; n++) {
    var key = invokeQueue[n][2][0];
    if(invokeQueue[n][0] === '$controllerProvider') appModel.app.push(key);
    var dependencies = injector.annotate(invokeQueue[n][2][1]);
    appModel[key] = dependencies;
  }
  console.log(appModel);
  var configBlocks = app._configBlocks;
  var configLen = configBlocks.length;
  for(var n=0; n < configLen; n++) {
    var key = 'config' + n.toString();
    var dependencies = injector.annotate(configBlocks[n][2][0]);
    appModel.app.push(key);
    appModel[key] = dependencies;
  }
};

Angalyzer.prototype.generateNodeMap = function generateNodeMap() {
  var appModel = this.appModel();
  // turn this: {"providerName": ["dependency1", "dependency2"]}
  // into this: {"name": "providerName", group

  var provider_index = {};
  var nodes = [];
  var links = [];
  for(var a in Object.keys(appModel)) {
    var k = Object.keys(appModel)[a];
    // If current provider is not already a node, create it now
    if(!provider_index[k]) {
      var new_node = {};
      new_node.name = k;
      if(k === 'app') {
        new_node.group = 1;
      }
      else if(k === '$') new_node.group = 2;
      else if(k === 'mainCtrl') new_node.group = 3;
      else if(k === 'otherCtrl') new_node.group = 3;
      else if(k === 'Factory1') new_node.group = 4;
      else if(k === 'Factory2') new_node.group = 4;
      else if(k === 'otherFactory') new_node.group = 4;
      else if(k === 'config0') new_node.group = 4;
      else if(k === 'myFilter') new_node.group = 4;
      else if(k === 'ui.bootstrap') new_node.group = 5;
      else if(k === 'ngRoute') new_node.group = 5;
      else {
        new_node.group = 8;
      }
      provider_index[k] = nodes.length;
      nodes.push(new_node);
    }
    // Loop through dependencies to create their nodes before creating links
    for(var n=0,len=appModel[k].length; n < len; n++) {
      if(!provider_index[appModel[k][n]]) {
        var new_node = {};
        new_node.name = appModel[k][n];
        if(appModel[k][n] === 'app') new_node.group = 1;
        else if(appModel[k][n].split('')[0] === '$') new_node.group = 2;
        else if(appModel[k][n] === 'mainCtrl') new_node.group = 3;
        else if(appModel[k][n] === 'otherCtrl') new_node.group = 3;
        else if(appModel[k][n] === 'Factory1') new_node.group = 4;
        else if(appModel[k][n] === 'Factory2') new_node.group = 4;
        else if(appModel[k][n] === 'otherFactory') new_node.group = 4;
        else if(appModel[k][n] === 'config0') new_node.group = 4;
        else if(appModel[k][n] === 'myFilter') new_node.group = 4;
        else if(appModel[k][n] === 'ui.bootstrap') new_node.group = 5;
        else if(appModel[k][n] === 'ngRoute') new_node.group = 5;
        else new_node.group = 8;
        provider_index[appModel[k][n]] = nodes.length;
        nodes.push(new_node);
      }
      // Create a link between provider and dependencies
      var new_link = {};
      new_link.source = provider_index[k];
      new_link.target = provider_index[appModel[k][n]];
      new_link.value = 1;
      links.push(new_link);
    }
  }
  console.log(nodes);
  console.log(links);
  return { nodes: nodes, links: links };
};

