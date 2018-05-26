//
// Simple rendering approach
// 
// collView.render();
// layoutView.render();
// layoutView.treeNodeRegion.show(collView);
// $('#mainRegion').html(layoutView.el);
// nodesCollection.fetch();


//
// Marionette App rendering approach
// 
var App = new Backbone.Marionette.Application();

App.addRegions({
    'mainRegion': '#mainRegion'
});

App.addInitializer(function(options) {
    App.mainRegion.show(layoutView);
    nodesCollection.fetch();
    layoutView.treeNodeRegion.show(collView);
});

App.start();
