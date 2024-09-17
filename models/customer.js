import { Schema, model } from "mongoose";

const customerSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  taxNumber: {
    type: String,
    default: "",
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

customerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
customerSchema.set("toJSON", {
  virtuals: true,
});

const Customer = model("Customer", customerSchema);
export default Customer;
