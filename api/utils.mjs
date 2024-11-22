import mongoose from "mongoose";

/**
 * Vérifie si l'erreur est une erreur de validation de Mongoose
 * @param {any} err L'erreur à vérifier
 * @returns {boolean} Vrai si l'erreur est une erreur de validation de Mongoose, faux sinon
 */
export function isValidationError(err) {
   return err instanceof mongoose.Error.ValidationError;
}

/**
 * Obtenir le message d'erreur de validation
 * @param {mongoose.Error.ValidationError} err L'erreur de validation
 * @returns {string|null} Le message d'erreur de validation
 */
export function getValidationErrorMessage(err) {
   return isValidationError(err)
      ? Object.values(err.errors)
         .map(e => e?.message)
         .filter(v => !!v)
         .join("\n")
      : null;
}