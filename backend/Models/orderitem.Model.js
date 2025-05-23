import mongoose from "mongoose";

const orderitemSchema = new mongoose.Schema(
  {
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    OrderDate: { type: Date, default: Date.now(), required: true },
    tableId: { type: String, required: true },
    request: { type: String, required: true },
    paid: { type: Boolean, default: false },
    deleteAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderitemSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

const Orderitem = mongoose.model("Orderitem", orderitemSchema);

export default Orderitem;
