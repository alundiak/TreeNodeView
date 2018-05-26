var LIView = Marionette.ItemView.extend({
    tagName: 'li',
    template: _.template('<span class="item-text"><%=itemText%></span><ul></ul>'),
    className: function() {
        return 'item-view-' + this.model.cid;
    },
    initialize: function() {
        console.log('INIT ITEM_VIEW');
    },
    render: function() {
        console.log('RENDER ITEM_VIEW', this);
        if (this.model.get('nodes')) {
            this.$el.html(this.template(this.model.attributes));
        } else {
            this.$el.html(this.template(this.model.attributes));
        }

        return this;
    },
    onRender: function() {
        console.log(this);
        // taken from http://jsfiddle.net/hoffmanc/NH9J6/ and reworked, to avoid useless empty UL at the end of LI.
        // if (this.collection.isEmpty()) {
        if (!this.model.get('nodes')) {
            this.$('ul:first').remove();
        }
    },
    events: {
        'click .item-text': 'handleCollapseExpand'
    },
    handleCollapseExpand: function(e) {
        // console.log(this, e);
        e.stopPropagation();
        $(e.delegateTarget).find('ul').toggle();
    }
});

var ULView = Marionette.CollectionView.extend({
    tagName: 'ul',
    // template: _.template('<%=text%>'),
    render: function() {
        console.log('RENDER COLLECTION_VIEW');
        if (this.model) {
            this.$el.html(this.template(this.model.attributes));
        }
        return this;
    },
    appendHtml: function(collectionView, itemView) {
        console.log(collectionView, itemView);
        // collectionView.$('li:first').append(itemView.el);
    },
    className: function() {
        // console.log(this);
        return 'collection-view-' + this.options.index;
    },
    initialize: function() {
        console.log('INIT COLLECTION_VIEW');
        // this is core code to behave recursively. 
        if (this.model && this.model.has('nodes') && this.model.get('nodes') instanceof Array) {
            // using new we avoid pass by reference of parent collection and rewrite original this.collection.
            // TODO
            this.collection = new Backbone.Collection(this.model.get('nodes'));
        }
        // console.log('CollectionView AFTER INIT code', this);
    },

    getItemView: function(nodeModel) {
        // console.log(nodeModel);
        if (nodeModel.has('nodes') && nodeModel.get('nodes') instanceof Array) {
            return ULView;
        } else {
            return LIView;
        }
    },

    // itemView: LIView,

    // buildItemView: function(item, ItemViewType, itemViewOptions) {
    //  console.log(item, ItemViewType, itemViewOptions);
    //     // build the final list of options for the item view type
    //     var options = _.extend({
    //         model: item
    //     }, itemViewOptions);
    //     // create the item view instance
    //     var view = new ItemViewType(options);
    //     // return it
    //     return view;
    // },

    itemViewOptions: function(model, index) {
        // do some calculations based on the model
        // console.log();
        return {
            index: index,
            fromParentOption: 'hello'
        };
    },
    itemEvents: {
        'onBeforeRender': function() {
            console.log('onBeforeRender');
        },
        'render': function() {
            console.log('an itemView has been rendered');
        },
        'onItemClose': function() {
            console.log('an itemView has been closed');
        },
    },

    // itemView events are traversed/forwarded up to collectionView
    itemViewEventPrefix: 'my:li', // if omitted then default value is "itemview"

    onClose: function() {
        console.log('custom cleanup or closing code, here');
    },
    collectionEvents: {

    }
});

var collView = new ULView({
    collection: nodesCollection
});
collView.on('render', function() {
    console.log('the collection view was rendered!');
});
// hack, to get the child view and trigger from it
// var childView = collView.children[myModel.cid];
// childView.trigger('do:something', 'do something!');
collView.on('my:li:render', function() {
    console.log('my:li item view was rendered');
});
// itemView events are traversed/forwarded up to collectionView
