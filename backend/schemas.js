const Joi = require("joi");

const addressSchema = Joi.object({
  street_address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postal_code: Joi.string().required(),
});

const hotelChainSchema = Joi.object({
  name: Joi.string().required(),
  address: addressSchema.required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
});

const hotelSchema = Joi.object({
  chain_id: Joi.number().required(),
  name: Joi.string().required(),
  address: addressSchema.required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  category: Joi.number().required(),
});

const updateHotelSchema = Joi.object({
  name: Joi.string().required(),
  address: addressSchema.required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  category: Joi.number().required(),
});

const roomSchema = Joi.object({
  hotel_id: Joi.number().required(),
  price: Joi.number().min(0).required(),
  amenities: Joi.string().required(),
  capacity: Joi.string()
    .valid("single", "double", "family", "suite")
    .required(),
  view: Joi.string().valid("sea", "mountain").required(),
  is_extendable: Joi.boolean(),
  problems: Joi.string().required(),
});

const updateRoomSchema = Joi.object({
  price: Joi.number().min(0).required(),
  amenities: Joi.string().required(),
  capacity: Joi.string()
    .valid("single", "double", "family", "suite")
    .required(),
  view: Joi.string().valid("sea", "mountain").required(),
  is_extendable: Joi.boolean(),
  problems: Joi.string().required(),
});

const employeeSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  address: Joi.string().required(),
  ssn: Joi.string().required(),
  hotel_id: Joi.number().integer().required(),
  role: Joi.string().required(),
});

const bookingSchema = Joi.object({
  check_in_date: Joi.date().required(),
  check_out_date: Joi.date().required(),
  room_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  total_cost: Joi.number().min(0).required(),
});

const inPersonBookingSchema = Joi.object({
  check_in_date: Joi.date().required(),
  check_out_date: Joi.date().required(),
  room_id: Joi.number().required(),
  customer_id: Joi.number().required(),
  total_cost: Joi.number().min(0).required(),
  employee_id: Joi.number().required(),
});

module.exports = {
  addressSchema,
  hotelChainSchema,
  hotelSchema,
  updateHotelSchema,
  roomSchema,
  updateRoomSchema,
  employeeSchema,
  bookingSchema,
  inPersonBookingSchema,
};
