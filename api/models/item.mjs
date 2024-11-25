import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Utilisé pour garantir l'unicité du permalink en cas de doublon

const itemSchema = new Schema({
   title: {
      type: String,
      required: [true, "Le champ `title` est requis"],
      maxLength: [100, "Le champ `title` ne doit pas dépasser 100 caractères"]
   },
   url: {
      type: String,
      validate: {
         validator: function (v) {
            return /^(http|https):\/\/[^ "]+$/.test(v);
         },
         message: props => `${props.value} n'est pas une URL valide!`
      },
      default: null
   },
   content: {
      type: String,
      default: "",
      trim: true,
   },
   latitude: {
      type: Number,
      min: [-90, "La latitude ne peut pas être inférieure à -90"],
      max: [90, "La latitude ne peut pas être supérieure à 90"],
      // @ts-ignore
      required: function () { return this.longitude !== undefined; } // Nécessaire si longitude est définie
   },
   longitude: {
      type: Number,
      min: [-180, "La longitude ne peut pas être inférieure à -180"],
      max: [180, "La longitude ne peut pas être supérieure à 180"],
      // @ts-ignore
      required: function () { return this.latitude !== undefined; } // Nécessaire si latitude est définie
   },
   private: {
      type: Boolean,
      default: true // Privé par défaut
   },
   sticky: {
      type: Boolean,
      default: false // Non épinglé par défaut
   },
   permalink: {
      type: String,
      unique: true,
      trim: true
   },
   tags: [{
      type: Schema.Types.ObjectId,
      ref: "Tag"
   }],
   created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Le champ `created_by` est requis pour identifier l'auteur"]
   },
}, { timestamps: true });

// Middleware pour générer automatiquement le `permalink` avant de sauvegarder l'item
itemSchema.pre("save", function (next) {
   if (!this.permalink) {
      // Transforme le `title` en un format adapté pour une URL
      const basePermalink = this.title
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, "-") // Remplace les caractères non-alphanumériques par des tirets
         .replace(/(^-|-$)+/g, "");   // Supprime les tirets en début et fin de chaîne

      // Utilise un UUID pour s'assurer de l'unicité en cas de doublon de `title`
      this.permalink = `${basePermalink}-${uuidv4()}`;
   }
   next();
});

export default model("Item", itemSchema);