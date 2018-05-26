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
        if (this.$('#visibilityTrigger').text() === 'Expand All'){
        	this.$('#visibilityTrigger').text('Collapse All');	
        }
        this.collection.fieldId = $(e.target).val();
        this.collection.fetch();
    },
    toggleVisibility: function(e) {
        var doCollapse = (e.target.innerText === 'Collapse All');
        e.target.innerText = doCollapse ? 'Expand All' : 'Collapse All';
        this.treeNodeRegion.currentView.trigger('collapseAllItems', doCollapse);
    }
});

var layoutView = new TreeNodeLayout();

// alternative flow of events triggering/handling
// layoutView.on('layout:all:collapse', function(flag) {
//     console.log('collapse event');
// });
