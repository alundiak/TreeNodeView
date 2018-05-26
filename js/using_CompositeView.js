//
// Ref. https://lostechies.com/derickbailey/2012/04/05/composite-views-tree-structures-tables-and-more/
// Based on my jsFiddle fork - http://jsfiddle.net/landike/k2d0k2hc/
// Made from http://jsfiddle.net/derickbailey/xX9X3/ and partially on http://jsfiddle.net/hoffmanc/NH9J6/
// 
// Shortly: Main view is CollectionView (UL) with itemView instances of CompositeView 
// CompositeView(s) instances built with dedicated template (LI). But LI contains nested UL.
// As result of recursive usage this.model.get('nodes') all nesting done in fact inside of CompositeView, 
// and this.$el is always root LI element. This causes need to event.stopPropagation() to avoid bubbling from child to parent.
//
var cachedModel1, cachedModel2;

var TreeCompositeView = Backbone.Marionette.CompositeView.extend({
    tagName: 'li', // LI used for compositeView, because if nested hierarchy, then inside of LI will be UL tag.
    template: _.template('<span class="item-text"><%=itemText%></span><ul></ul>'),
    initialize: function() {
        this.applyTestCachingCode();        
        this.collection = new Backbone.Collection(this.model.get('nodes'));
    },
    className: function() {
        return 'item-view-' + this.options.model.cid;
    },
    appendHtml: function(collectionView, itemView) {
        collectionView.$('ul:first').append(itemView.el);
    },
    onRender: function() {
        if (this.collection.isEmpty()) {
            // taken from http://jsfiddle.net/hoffmanc/NH9J6/ and reworked, to avoid useless empty UL at the end of LI.
            this.$('ul:first').remove();
        } else if (this.options.hasOwnProperty('itemViewIndex')) { // having itemViewIndex is a sign that it's root LI element.
            // added to implement chevron-like icon behavior.
            this.$el.prepend('<span class="glyphicon glyphicon-chevron-down"></span>');
        }
    },
    events: {
        'click .item-text': 'handleCollapseExpand',
        'click .glyphicon': 'handleCollapseExpand'
    },
    handleCollapseExpand: function(e) {
        // it will be click on SPAN element, text itself, and we need then collapse/expand ONLY SPAN's parent LI element.
        // if click happens on nested level far down, it will propagate to the top and will collapse all leafs. So we better stop it.
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
        this.trigger('customEventAndrii', true);
    },
    itemEvents: {
        'onBeforeRender': function() {
            console.log('LI onBeforeRender');
        },
        'render': function() {
            console.log('LI itemView has been rendered');
        },
        'onItemClose': function() {
            console.log('LI itemView has been closed');
        },
        'customEventAndrii': function() {
            console.log('customEventAndrii triggered from LI');
        }
    },
    applyTestCachingCode: function(){
        if (cachedModel1 && this.model.get('itemText') === 'Level A1 - 1'){
            cachedModel2 = this.model; // like temp2 from console.    
            let diff = cachedModel1 !== cachedModel2;
            console.log(`Cashed (cid:${cachedModel1.cid}) and New model (cid:${cachedModel2.cid})) ARE DIFFERENT - ${diff}`);
        } else if (this.model.get('itemText') === 'Level A1 - 1'){
            cachedModel1 = this.model; // like temp1 from console.    
        }
    },
    onClose: function() {
        // executed automatically, on itemView change/re-render/etc
        console.log('main compositeView custom cleanup/closing code');
    },
});

var TreeCollectionView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'collection-view',
    initialize: function() {
        // this event will be triggered from external world (layoutView);
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
    itemView: TreeCompositeView,

    itemEvents: {
        'onBeforeRender': function() {
            console.log('UL onBeforeRender');
        },
        'render': function() {
            // by providing itemEvents here, in UL (CollectionView) we subscribe for ALL itemView events.
            // so if 3 itemView instances will be rendered, then 3 console.log() entries will be executed.
            console.log('UL itemView has been rendered', this);
        },
        'onItemClose': function() {
            console.log('UL itemView has been closed');
        },
        'customEventAndrii': function() {
            // same with custom event - if event triggered from itemView (child view) then it will be listened 3 times here.
            console.log('customEventAndrii triggered from LI (child), but propagated to UL (parent)');
        }
    },
    // will be passed ONLY to root LI elements !!! because all other ULs, are elements of itemView
    itemViewOptions: function(model, index) {
        return {
            modelCidFromItemView: model.cid,
            itemViewIndex: index, // will be available ONLY for root LI elements !!!
            fromParentOption: 'hello'
        };
    },
    onClose: function() {
        // looks like not executed automatically.
        console.log('main collectionView custom cleanup/closing code');
    },
});

var collView = new TreeCollectionView({
    collection: nodesCollection
});
