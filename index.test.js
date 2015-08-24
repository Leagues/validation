import _ from 'lodash';
import {expect} from 'chai';
import validation from './index';

describe("validation()", function() {

  it("is a function", function() {
    expect(validation).to.be.a('function');
  });

  it("returns a validate function", function() {
    expect(validation()).to.be.a('function');
  });

});

describe("validate()", function() {

  _.each({
    "schema is not found": {
      name: "unknown",
      payload: {},
      result: {
        valid: false,
        invalid: true,
        errors: [{
          field: "",
          message: "validator not found",
          value: "unknown"
        }]
      }
    },
    "payload validates correctly": {
      name: "foo",
      schema: {
        type: "string",
        required: true
      },
      payload: "bar",
      result: {
        valid: true,
        invalid: false,
        errors: null
      }
    },
    "payload validates incorrectly": {
      name: "foo",
      schema: {
        type: "string",
        required: true
      },
      payload: 5,
      result: {
        valid: false,
        invalid: true,
        errors: [{
          field: "data",
          message: "is the wrong type",
          value: 5
        }]
      }
    }
  }, function(data, key) {
    it("validates as expected when "+key, function() {
      let schemas = data.schema ? {
        [data.name]: data.schema
      } : undefined;
      let validate = validation(schemas);
      let result = validate(data.name, data.payload);
      expect(result).to.eql(data.result);
    });
  });

});