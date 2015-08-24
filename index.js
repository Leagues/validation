import _ from "lodash";
import validator from "is-my-json-valid";

export default function(schemas, formats) {

  // Compile schemas
  let validators = _(schemas).reduce(function(results, schema, name) {
    if (!name || !schema) return results;
    results[name.toLowerCase()] = validator(schema,{
      formats: formats,
      verbose: true,
      greedy: true
    });
    return results;
  }, {});

  return function(schemaName, payload) {
    function unknownValidator() {
      return false;
    }
    unknownValidator.errors = [{
      field: "",
      message: "validator not found",
      value: schemaName
    }];

    schemaName = schemaName.toLowerCase();
    let validate = validators[schemaName] || unknownValidator;
    let result = validate(payload);
    return {
      valid: result,
      invalid: !result,
      errors: validate.errors
    };
  };

};
