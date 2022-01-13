const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        count: Number,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "İşlem aşamasında",
      enum: [
        "İşlem aşamasında",
        "Kapıda ödeme",
        "İşleme alındı",
        "Sevk edildi",
        "İptal edildi",
        "Tamamlandı",
      ],
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

exports.Order = mongoose.model("order", orderSchema);
