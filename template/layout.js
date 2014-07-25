var slice = [].slice;

module.exports = function (title) {
  var body = slice.call(arguments, 1);
  return ["html", { lang: "en" },
    ["head",
      ["title", title]
    ],
    ["body",
      ["h1", title],
      body
    ]
  ];
};
