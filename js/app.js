//
// Use layout, but in fact this all below code can be integrated inside of CompoSiteView
//
var TreeNodeLayout = Marionette.Layout.extend({
    template: '#layout-template',
    regions: {
        treeNodeRegion: '.tree-node-region'
    },
    initialize: function() {
        this.collection = nodesCollection;
    },
    events: {
        'change select': 'changeData',
        'click a#visibilityTrigger': 'toggleVisibility'
    },
    changeData: function(e) {
        this.collection.fieldId = $(e.target).val();
        this.collection.fetch();
    },
    toggleVisibility: function(e) {
        console.log(e);
        if (e.target.innerText === 'Collapse') {
            e.target.innerText = 'Expand';
            this.doExpand = true;
        } else {
            e.target.innerText = 'Collapse';
            this.doCollapse = true;
        }
    }
});

var layoutView = new TreeNodeLayout();

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
