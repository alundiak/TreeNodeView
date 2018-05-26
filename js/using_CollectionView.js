var LIView = Marionette.ItemView.extend({
    tagName: 'li',
    template: _.template('<span class="item-text"><%=itemText%></span>'),
    className: function() {
        return 'item-view-' + this.model.cid;
    },
    // initialize: function() {
        
    // },
    // render: function() {
    //     console.log('RENDER ITEM_VIEW', this);
    //     // if (this.model.get('nodes')) {
    //     //     var cV = new ULView({
    //     //         collection: new Nodes(this.model.get('nodes'))
    //     //     });
    //     //     this.$el.find('ul:first').html(cV.render().el);
    //     // } else {
    //     //     this.$el.html(this.template(this.model.attributes));
    //     // }

    //     return this;
    // },
    // appendHtml: function(collectionView, itemView) {
    //     // itemView.close();
    //     // collectionView.$('ul:first').append(itemView.el);
    // },
    onBeforeRender: function() { 
        console.log('onBeforeRender');
    },
    onRender: function() { // isn't executed, if render() overridden !!!
        console.log('onRender');
        if (this.model.get('nodes')) {
            // 1 - we add an icon
            this.$el.prepend('<span class="glyphicon glyphicon-chevron-down"></span>');

            // 2 - we inject UL element for nodes.
            let anotherCollectionView = new ULView({
                collection: new Nodes(this.model.get('nodes'))
            });
            let element = anotherCollectionView.render().el;
            this.$el.append(element);
        }
    },
    onClose: function() { // works always
        console.log('onClose');
    },
    events: {
        'click .item-text': 'handleCollapseExpand'
    },
    handleCollapseExpand: function(e) {
        e.stopPropagation();
        $(e.delegateTarget).find('ul').toggle();
        this.changeIcon();
    },
    changeIcon: function() {
        var $down = this.$el.find('.glyphicon-chevron-down');
        var $right = this.$el.find('.glyphicon-chevron-right');
        if ($down.length) {
            $down.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
        } else {
            $right.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
        }
    }
});

var ULView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: function() {
        if (this.model && this.model.cid) {
            return 'collection-view-' + this.model.cid;
        } else if (this.cid) {
            return 'collection-view-' + this.cid;
        } else {
            return 'collection-view';
        }
    },
    initialize: function() {
        //
        // this is core code to behave recursively. 
        // 
        
        // 
        // Alternative 1
        // 
        // this.model will be available, when ULView will be used as itemView instance for collectionView
        // if (this.model && this.model.has('nodes') && this.model.get('nodes') instanceof Array) {
        //     // using new collection we avoid pass by reference of parent collection and rewrite original this.collection.
        //     this.collection = new Backbone.Collection(this.model.get('nodes'));
        // }
        
        // 
        // Alternative 2
        // 
        this.on('collapseAllItems', function(flag) {
            // Yes, .toggle() works differently here, because if some items were previously hidden (by .toggle() from CompositeView), 
            // then global CSS selector '> li ul' doesn't work for elements with "display:none;".
            // But .show() / .hide() simply show or hide all elements, doesn't matter if it was previously shown/hidden.
            // So using show()/hide() is good approach when implementing "Collapse/Expand All" kind of feature.
            if (flag) {
                this.$('li ul').hide();
            } else {
                this.$('li ul').show();
            }
        })
    },

    // This approach would be great if 2 kind of itemView explicitly and only for one level.
    // getItemView: function(nodeModel) {
    //     if (nodeModel.has('nodes') && nodeModel.get('nodes') instanceof Array) {
    //         return ULView;
    //     } else {
    //         return LIView;
    //     }
    // },

    itemView: LIView,

    // buildItemView: function(itemModel, ItemViewType, itemViewOptions) {
    //     console.log(itemModel, ItemViewType, itemViewOptions);
    //     // build the final list of options for the item view type
    //     var options = _.extend({
    //         model: itemModel
    //     }, itemViewOptions);
    //     // create the item view instance
    //     var view = new ItemViewType(options);
    //     // console.log(view instanceof LIView); // true
    //     // console.log(view instanceof ULView); // false
    //     return view;
    // },

    itemViewOptions: function(model, index) {
        return {
            itemViewIndex: index,
            fromParentOption: 'hello'
        };
    },

    // itemView events are traversed/forwarded up to collectionView
    itemEvents: {
        'beforeRender': function() { // doesn't work. Looks either bug or wrong code or not supported.
            console.log('itemView beforeRender. Using itemEvents.beforeRender');
        },
        'onBeforeRender': function() { // doesn't work. Looks either bug or wrong code or not supported.
            console.log('itemView onBeforeRender. Using itemEvents.onBeforeRender');
        },
        'render': function(/*eventName, viewInstance*/) { // works
            console.log('itemView has been rendered. Using itemEvents.render');
        },
        'close': function() { // works
            console.log('itemView has been closed. Using itemEvents.close');
        },
        'onClose': function() { // doesn't work. Looks either bug or wrong code or not supported.
            console.log('itemView has been closed. Using itemEvents.onClose');
        },
        'onItemClose': function() { // doesn't work. Looks either bug or wrong code or not supported.
            console.log('itemView has been closed. Using itemEvents.onItemClose');
        }
    },

    // if prefix omitted then default value is "itemview"
    itemViewEventPrefix: 'lundiakItemView',

    onClose: function() { // works always
        console.log('main collectionView custom cleanup/closing code');
    },

    collectionEvents: {
        // in case of need to handle reset/add/remove/etc. But.
        // 
        // https://marionettejs.com/docs/v1.8.8/marionette.collectionview.html#collectionview-automatic-rendering
        // The collection view binds to the "add", "remove" and "reset" events of the collection that is specified.
        // When the collection for the view is "reset", the view will call RENDER on itself and re-render the entire collection.
        // 
        // Note for work with Alex:
        // - no need to recreate view instance, and re-render.
        // - all what is needed to change collection - re-fetch() reset()
        // 
    }
});

var collView = new ULView({
    collection: nodesCollection
});
collView.on('render', function() {
    console.log('collectionView has been rendered. Using instance .on() subscription.');
});
// hack, to get the child view and trigger from it
// var childView = collView.children[myModel.cid];
// childView.trigger('do:something', 'do something!');
collView.on('lundiakItemView:render', function() {
    console.log('itemView has been rendered. Using prefix.');
});
// itemView events are traversed/forwarded up to collectionView
