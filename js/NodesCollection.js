var Nodes = Backbone.Collection.extend({
    initialize: function(models, options) {

    },
    url: function(options) {
        var fileId = this.fieldId || 1;
        return `data${fileId}.json`;
    }
});

var nodesCollection = new Nodes();