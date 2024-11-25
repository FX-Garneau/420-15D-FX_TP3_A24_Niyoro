import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

/**
 * Expression rationnelle pour valider les adresses courriel (RFC 6531)
 */
const regexCourriel = new RegExp(
   // eslint-disable-next-line no-useless-escape
   /^(?<localPart>(?<dotString>[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+(\.[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+)*)|(?<quotedString>"([\x20-\x21\x23-\x5B\x5D-\x7E\u{80}-\u{10FFFF}]|\\[\x20-\x7E])*"))(?<!.{64,})@(?<domainOrAddressLiteral>(?<addressLiteral>\[((?<IPv4>\d{1,3}(\.\d{1,3}){3})|(?<IPv6Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7})|(?<IPv6Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?)|(?<IPv6v4Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){5}:\d{1,3}(\.\d{1,3}){3})|(?<IPv6v4Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3}:)?\d{1,3}(\.\d{1,3}){3})|(?<generalAddressLiteral>[a-z0-9-]*[[a-z0-9]:[\x21-\x5A\x5E-\x7E]+))\])|(?<Domain>(?!.{256,})(([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))(\.([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))*))$/iu,
);

const userSchema = new Schema({
   username: {
      type: String,
      unique: true,
      required: [true, "Le champ `username` est requis"],
      minLength: [1, "Le `username` doit contenir au moins 1 caractère"],
      maxLength: [50, "Le `username` ne peut pas dépasser 50 caractères"],
      trim: true
   },
   first_name: {
      type: String,
      required: [true, "Le champ `first_name` est requis"],
      minLength: [1, "Le `first_name` doit contenir au moins 1 caractère"],
      maxLength: [50, "Le `first_name` ne peut pas dépasser 50 caractères"],
      trim: true
   },
   last_name: {
      type: String,
      required: [true, "Le champ `last_name` est requis"],
      minLength: [1, "Le `last_name` doit contenir au moins 1 caractère"],
      maxLength: [50, "Le `last_name` ne peut pas dépasser 50 caractères"],
      trim: true
   },
   email: {
      type: String,
      unique: true,
      required: [true, "Le champ `email` est requis"],
      match: [regexCourriel, "Le champ `email` n'est pas un courriel valide"],
      trim: true
   },
   password: {
      type: String,
      required: [true, "Le champ `password` est requis"],
      minLength: [6, "Le `password` doit contenir au moins 8 caractères"]
   },
   avatar: {
      type: String,
      default: null
   },
   is_active: {
      type: Boolean,
      required: [true, "Le champ `is_active` est requis"],
      default: true
   },
   is_admin: {
      type: Boolean,
      required: [true, "Le champ `is_admin` est requis"],
      default: false
   }
}, { timestamps: true });

// DONE: Ajouter un hook pour hasher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre("save", async function (next) {
   if (this.isModified("password"))
      this.password = await bcrypt.hash(this.password, 10);
   next();
});

export default model("User", userSchema);