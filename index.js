// var Node = new Backbone.Model();

var Nodes = Backbone.Collection.extend({
    initialize: function(models, options) {

    },
    url: function(options) {
        var fileId = this.fieldId || 1;
        return `data${fileId}.json`;
    }
});

var nodesCollection = new Nodes();


var LIView = Marionette.ItemView.extend({
    tagName: 'li',
    template: _.template('<%=text%>'),
    className: function() {
        return 'item-level-' + this.cid;
    },
    initialize: function() {

    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    events: {
        'click li': 'clickLiElement'
    },
    clickLiElement: function(e) {
        console.log(this, e);
    }
});

var ULView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: function() {
        return 'collection-level-' + this.cid;
    },
    initialize: function() {
        console.log(this);
    },
    
    // getItemView: function(nodeModel) {
    //     if (nodeModel.has('node') && nodeModel.get('node') instanceof Array) {
    //         return ULView;
    //     } else {
    //         return LIView;
    //     }
    // },
    
    itemView: LIView,
     
    itemViewOptions: {
        fromParentOption: 'hello'
    },
    itemEvents: {
        "render": function() {
            console.log("an itemView has been rendered");
        },
        "onItemClose": function() {
            console.log("an itemView has been closed");
        },
    },
    onClose: function() {
        console.log('custom cleanup or closing code, here');
    },
    collectionEvents: {

    }
});

var TreeNodeLayout = Marionette.Layout.extend({
    template: '#layout-template',
    regions: {
        treeNodeRegion: '.tree-node-region'
    },
    initialize: function() {
        this.collection = nodesCollection;
    },
    events: {
        'change select': 'changeData'
    },
    changeData: function(e) {
        this.collection.fieldId = $(e.target).val();
        this.collection.fetch();
    }
});

//
//
//

var App = new Backbone.Marionette.Application();

App.addRegions({
    'mainRegion': '#mainRegion'
});

App.addInitializer(function(options) {
    var collView = new ULView({
        collection: nodesCollection
    });
    collView.on("render", function() {
        console.log("the collection view was rendered!");
    });
    // hack, to get the child view and trigger from it
    // var childView = collView.children[myModel.cid];
    // childView.trigger("do:something", "do something!");

    var layoutView = new TreeNodeLayout();

    App.mainRegion.show(layoutView);

    nodesCollection.fetch();
    layoutView.treeNodeRegion.show(collView);
});

App.start();
