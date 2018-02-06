const tagger = {
  getTags: function(type) {
    return String(type).split('|');
  },
  hasAllTags: function(tagsThatContains, tagsInside) {
    for(let tag of tagsInside) {
      if( !this.hasTag(tagsThatContains, tag) )
        return false;
    }
    return true;
  },
  hasTag: function(tagsThatContains, tag) {
    return tagsThatContains.filter(tg=>tg==tag).length > 0;
  },
  addTag: function(typeOrTags, tagToAdd) {
    if( typeOrTags instanceof Array )
      return this.addTagToTags(tagToAdd, typeOrTags);
    return this.getType( this.addTagToTags(tagToAdd, this.getTags(typeOrTags)) );
  },
  addTagToTags: function(tagToAdd, tags) {
    tags.push(tagToAdd);
    return tags;
  },
  getType: function(tags) {
    return tags.join('|');
  }
};

module.exports = tagger;
