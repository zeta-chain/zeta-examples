module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.addHelper(
    "uppercasify",
    function (
      /** @type string[] */
      words
    ) {
      /**
       * @example cross-chain-warriors => CrossChainWarriors
       */
      return (
        words
          // Make first letter uppercase
          .replace(/[a-z]/, (f) => f.toUpperCase())
          // replace dash + letter for uppercase letter
          .replace(/-[a-z]/g, (v) => v.replace(/-/g, "").toUpperCase())
      );
    }
  );

  plop.addHelper(
    "camelcasify",
    function (
      /** @type string[] */
      words
    ) {
      /**
       * @example cross-chain-warriors => crossChainWarriors
       */
      return (
        words
          // replace dash + letter for uppercase letter
          .replace(/-[a-z]/g, (v) => v.replace(/-/g, "").toUpperCase())
      );
    }
  );

  plop.addHelper(
    "separe",
    function (
      /** @type string[] */
      words
    ) {
      /**
       * @example cross-chain-warriors => Cross Chain Warriors
       */
      return (
        words
          // Make first letter uppercase
          .replace(/[a-z]/, (f) => f.toUpperCase())
          // replace dash + letter for uppercase letter + space
          .replace(/-[a-z]/g, (v) => v.replace(/-/g, " ").toUpperCase())
      );
    }
  );

  plop.setGenerator("New example", {
    description: "Add new ZetaChain example",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Example name",
        validate: (
          /** @type string */
          name
        ) => {
          return (
            /^[a-z]+(-[a-z]+)*$/.test(name) ||
            "Name should include only lowercase letters and dashes, and shouldn't start or end with a dash."
          );
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "examples/{{name}}",
        base: `codegen/examples`,
        templateFiles: `codegen/examples/**/*`,
      },
    ],
  });
};
