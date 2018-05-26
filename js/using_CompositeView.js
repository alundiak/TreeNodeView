//
// Based on my jsFiddle fork - ttp://jsfiddle.net/landike/k2d0k2hc/
// Made from http://jsfiddle.net/derickbailey/xX9X3/ and partially on http://jsfiddle.net/hoffmanc/NH9J6/
//
var TreeCompositeView = Backbone.Marionette.CompositeView.extend({
    template: _.template('<span class="item-text"><%=text%></span><ul></ul>'),
    tagName: 'li', // LI used for compositeView, because if nested hierarchy, then inside of LI will be UL tag.
    initialize: function() {
        this.collection = new Backbone.Collection(this.model.get('nodes'));
    },
    className: function() {
        return 'item-view-' + this.options.itemViewIndex;
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
        'click .item-text': 'clickLiElement'
    },
    clickLiElement: function(e) {
        // it will be click on SPAN element, text itself, and we need then collapse/expand ONLY SPAN's parent LI element.
        // TODO
        
        console.log(this, e);
    }
});

var TreeCollectionView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'collection-view',
    itemView: TreeCompositeView,
    itemViewOptions: function(model, index) {
        return {
            itemViewIndex: index, // for unique class of UL element
            fromParentOption: 'hello'
        };
    },
});

var collView = new TreeCollectionView({
    collection: nodesCollection
});