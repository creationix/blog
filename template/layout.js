var slice = [].slice;

module.exports = function (title) {
  var body = slice.call(arguments, 1);
  return ["html", {lang: "en"},
    ["head",
      ["title", title],
      ["meta", {charset: "utf-8"}],
      ["link", {rel: "shortcut icon", href: ""}],
      ["meta", {name: "description", content: ""}],
      ["cond-comment", "lt IE 9",
        ["script", {src:"//html5shim.googlecode.com/svn/trunk/html5.js"}],
      ],
      ["cond-comment", "lte IE 7",
        ["script", {src:"js/lte-ie7.js"}],
      ],
      // Mobile Specific Metas
      ["meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1"
      }],
      // CSS
      ["link", { rel: "stylesheet", href: "css/style.css" }],
    ],
    ["body",
      ["h1", title],
      body
    ]
  ];
};
