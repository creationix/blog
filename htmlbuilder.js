module.exports = render;
render.raw = function (html) {
  return new RawHtml(html);
};

var slice = [].slice;

var CLASS_MATCH = /\.[^.#]+/g,
    ID_MATCH = /#[^.#]+/,
    TAG_MATCH = /^[^.#]+/;

function stripFirst(part) {
  return part.substr(1);
}

function render(value) {
  if (value instanceof RawHtml) return value.html;
  if (typeof value === "string") return escapeHtml(value);
  if (!Array.isArray(value)) {
    throw new Error("Value must be array, string, or raw html");
  }
  var tag = "div", attributes = {};
  var id, classes;
  var first = value[0];
  if (typeof value[0] === "string") {
    value = value.slice(1);
    var match = first.match(TAG_MATCH);
    if (match) {
      tag = match[0];
      if (specialTags[tag]) {
        tag = specialTags[tag];
      }
      else if (!isElement[tag]) {
        throw new Error(tag + " is not a valid HTML5 tag.");
      }
    }
    match = first.match(CLASS_MATCH);
    if (match) classes = match.map(stripFirst).join(' ');
    match = first.match(ID_MATCH);
    if (match) id = match[0].substring(1);
  }
  else if (typeof first === "function") {
    return render(first.apply(null, value.slice(1)));
  }
  else if (Array.isArray(first)) {
    return value.map(render).join("");
  }
  var next = value[0];
  if (next && !Array.isArray(next) && typeof next === "object") {
    attributes = next;
    value = value.slice(1);
  }
  if (id) attributes.id = id;
  if (classes) {
    attributes.class = attributes.class ?
      attributes.class + " " + classes :
      classes;
  }
  if (typeof tag === "function") {
    return tag.apply(null, value);
  }
  var html = "<" + tag;
  var keys = Object.keys(attributes);
  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];
    var attribute = attributes[key];
    if (attribute === true) {
      html += " " + key;
    }
    else {
      html += " " + key + '="' + escapeHtml(attribute, true) + '"';
    }
  }
  html += ">";
  if (voidElements[tag]) {
    if (value.length) {
      throw new Error("No body allowed in " + tag);
    }
    return html;
  }
  html += value.map(render).join("") + "</" + tag + ">";
  if (tag === "html") {
    html = "<!DOCTYPE html>" + html;
  }
  return html;
}

var specialTags = {
  "cond-comment": function (condition) {
    var body = slice.call(arguments, 1);
    return "<!--[if " + condition.replace(/--+/g, "-") + "]>" +
      body.map(render).join("") +
      "<![endif]-->";
  },
  "comment": function (comment) {
    return "<!-- " + comment.replace(/--+/g, "-") + "-->";
  },
};

var isElement = {};
[ // Root element
  "html",
  // Document metadata
  "head title base link meta style",
  // Scripting
  "script noscript template",
  // Sections
  "body section nav article aside h1 h2 h3 h4 h5 h6 header footer address main",
  // Grouping content
  "p hr pre blockquote ol ul li dl dt dd figure figcaption div",
  // Text-level semantics
  "a em strong small s cite q dfn abbr data time code var samp kbd sub sup i b u mark ruby rt rp bdi bdo span br wbr",
  // Edits
  "ins del",
  // Embedded content
  "img iframe embed object param video audio source track canvas map area svg math",
  // Tabular data
  "table caption colgroup col tbody thead tfoot tr td th",
  // Forms
  "form fieldset legend label input button select datalist optgroup option textarea keygen output progress meter",
  // Interactive elements
  "details", "summary", "menuitem", "menu"
].forEach(function (tags) {
  tags.split(" ").forEach(function (tag) {
    isElement[tag] = true;
  });
});

var voidElements = {};
"area base br col command embed hr img input keygen link meta param source track wbr".split(" ").forEach(function (tag) {
  voidElements[tag] = true;
});

// Will act like a string for everything except bracket access.
function RawHtml(html) {
  this.html = html;
}

var escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

function escapeHtml(string, quotes) {
  return String(string).replace(quotes ? /[&<>"]/g : /[&<>]/g, function (char) {
    return escapeMap[char];
  });
}
