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
        'click #visibilityTrigger': 'toggleVisibility'
    },
    changeData: function(e) {
        this.$('#visibilityTrigger').text('Collapse All');
        this.collection.fieldId = $(e.target).val();
        this.collection.fetch();
    },
    toggleVisibility: function(e) {
        // Yes, .toggle() works differently here, because if some items were previously hidden (by .toggle() from CompositeView), 
        // then global CSS selector '> lu ul' doesn't work for elements with "display:none;".
        // But .show() / .hide() simply show or hide all elements, doesn't matter if it was previously shown/hidden.
        // So using show()/hide() is good approach when implementing "Collapse/Expand All" kind of feature.
        if (e.target.innerText === 'Collapse All') {
            e.target.innerText = 'Expand All';
            // this.$('.collection-view > li ul').hide();
            this.treeNodeRegion.currentView.$('li ul').hide();
        } else {
            e.target.innerText = 'Collapse All';
            // this.$('.collection-view > li ul').show();
            this.treeNodeRegion.currentView.$('li ul').show();
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
