const tagger = {
  getTags: function(type) {
    return type.split('|');
  },
  hasAllTags: function(tagsThatContains, tagsInside) {
    for(let tag in tagsInside) {
      if( !this.hasTag(tagsThatContains, tag) )
        return false;
    }
    return true;
  },
  hasTag: function(tagsThatContains, tag) {
    return tagsThatContains.filter(tg=>tg==tag).length > 0;
  },
};

module.exports = tagger;
