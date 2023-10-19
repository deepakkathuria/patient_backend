const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  identifier: {
    type: String, // A unique value that identifies the patient
    required: true
  },
  name: {
    family: {
      type: String,
      required: true // Last name
    },
    given: {
      type: String,
      required: true // First name
    }
  },
  telecom: {
    type: String, // Contact detail, could be phone or email
    required: true
  },
  gender: String, // male | female | other | unknown
  birthDate: Date,
  address: {
    city: String,
    state: String,
    country: String
  }
});

module.exports = mongoose.model('Patient', patientSchema);
