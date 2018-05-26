//
// Ref. https://lostechies.com/derickbailey/2012/04/05/composite-views-tree-structures-tables-and-more/
// Based on my jsFiddle fork - http://jsfiddle.net/landike/k2d0k2hc/
// Made from http://jsfiddle.net/derickbailey/xX9X3/ and partially on http://jsfiddle.net/hoffmanc/NH9J6/
//
var TreeCompositeView = Backbone.Marionette.CompositeView.extend({
    template: _.template('<span class="item-text"><%=itemText%></span><ul></ul>'),
    tagName: 'li', // LI used for compositeView, because if nested hierarchy, then inside of LI will be UL tag.
    initialize: function() {
        this.collection = new Backbone.Collection(this.model.get('nodes'));
    },
    className: function() {
        return 'item-view-' + this.options.model.cid;
    },
    appendHtml: function(collectionView, itemView) {
        collectionView.$('ul:first').append(itemView.el);
    },
    onRender: function() {
        // taken from http://jsfiddle.net/hoffmanc/NH9J6/ and reworked, to avoid useless empty UL at the end of LI.
        if (this.collection.isEmpty()) {
            this.$('ul:first').remove();
        }
    },
    events: {
        'click .item-text': 'handleCollapseExpand'
    },
    handleCollapseExpand: function(e) {
        // it will be click on SPAN element, text itself, and we need then collapse/expand ONLY SPAN's parent LI element.
        // if click happens on nested level far down, it will propagate to the top and will collapse all leafs. So we better stop it.
        e.stopPropagation();

        $(e.delegateTarget).find('ul').toggle();
    }
});

var TreeCollectionView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'collection-view',
    
    itemView: TreeCompositeView,

    // will be passed ONLY to root LI elements !!! because all other ULs, are elements of itemView
    itemViewOptions: function(model, index) {
        return {
            modelCidFromItemView: model.cid,
            itemViewIndex: index, // for unique class of UL element
            fromParentOption: 'hello'
        };
    },
});

var collView = new TreeCollectionView({
    collection: nodesCollection
});