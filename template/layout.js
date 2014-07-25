
module.exports = function (title, body) {
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
